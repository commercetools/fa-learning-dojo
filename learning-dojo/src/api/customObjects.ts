


import axios from 'axios';
import { buildApiUrl } from '@commercetools-frontend/application-shell';
import createHttpUserAgent from '@commercetools/http-user-agent';
import { executeHttpClientRequest } from '@commercetools-frontend/application-shell';

// Build a UA string for Sentry / CT proxy logs:
const userAgent = createHttpUserAgent({
  name: 'fa-learning-dojo',
  version: '1.0.0',
  libraryName: 'learning-dojo',
  contactEmail: 'support@your-company.com',
});

/**
 * Mirrors the CT CustomObject<T> resource schema.
 */
export type CustomObject<T> = {
  id: string;
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  container: string;
  key: string;
  value: T;
};

/**
 * Fetches the CustomObject envelope for {container, key}.
 * Throws if 404, so callers can catch & seed.
 */
export async function fetchCustomObject<T>(opts: {
  projectKey: string;
  container: string;
  key: string;
}): Promise<CustomObject<T>> {
  const { projectKey, container, key } = opts;
  const response = await executeHttpClientRequest(
    async (options) => {
      const res = await axios.get<CustomObject<T>>(
        buildApiUrl(`/proxy/ctp/${projectKey}/custom-objects/${container}/${key}`),
        {
          headers: options.headers,
          withCredentials: options.credentials === 'include',
        }
      );
      return {
        data: res.data,
        statusCode: res.status,
        getHeader: (h: string) => res.headers[h],
      };
    },
    { userAgent }
  );
  // response.data is already a CustomObject<T>
  return response;
}

/**
 * Creates or updates (upserts) a CustomObject.
 *
 * - If no existing object → creates (no version in body).
 * - If existing object → adds `version`, causing CT to treat it as an update.
 */
export async function upsertCustomObject<T>(opts: {
  projectKey: string;
  container: string;
  key: string;
  value: T;
}): Promise<CustomObject<T>> {
  const { projectKey, container, key, value } = opts;

  // 1) try fetch existing to get version
  let existingVersion: number | undefined;
  try {
    const existing = await fetchCustomObject<T>({ projectKey, container, key });
    existingVersion = existing.version;
  } catch (err: any) {
    const status = err.response?.status || err.statusCode;
    if (status !== 404) {
      console.error('Unexpected error fetching for upsert:', err);
      throw err;
    }
    // 404 → treat as brand-new create
  }

  // 2) Build the POST body per CTP API
  const body: Record<string, any> = { container, key, value };
  if (existingVersion !== undefined) {
    body.version = existingVersion;
  }

  // 3) POST /custom-objects to create or update
  const response = await executeHttpClientRequest(
    async (options) => {
      const res = await axios.post<CustomObject<T>>(
        buildApiUrl(`/proxy/ctp/${projectKey}/custom-objects`),
        body,
        {
          headers: options.headers,
          withCredentials: options.credentials === 'include',
        }
      );
      return {
        data: res.data,
        statusCode: res.status,
        getHeader: (h: string) => res.headers[h],
      };
    },
    { userAgent }
  );
  return response;
}


export async function fetchCustomObjectsByContainer<T>(opts: {
  projectKey: string;
  container: string;
}): Promise<CustomObject<T>[]> {
  const { projectKey, container } = opts;

  // 1️⃣ Fetch via CT proxy
  const wrapper = await executeHttpClientRequest(
    async (options) => {
      const res = await axios.get(
        buildApiUrl(`/proxy/ctp/${projectKey}/custom-objects`),
        {
          headers: options.headers,
          withCredentials: options.credentials === 'include',
          params: {
            where: `container="${container}"`,
            limit: 500,
          },
        }
      );
      return {
        data: res.data,
        statusCode: res.status,
        getHeader: (h: string) => res.headers[h],
      };
    },
    { userAgent }
  );

  // 2️⃣ Unwrap the body
  const body = wrapper.data;

  // Sometimes proxies return a bare array of objects:
  if (Array.isArray(body)) {
    return body as CustomObject<T>[];
  }

  // Standard CTP list response: { count, total, offset, results: CustomObject<T>[] }
  if (body && Array.isArray((body as any).results)) {
    return (body as any).results as CustomObject<T>[];
  }

  console.error('Unexpected list-by-container response', body);
  throw new Error(
    `Unexpected response from list custom-objects: ${JSON.stringify(body)}`
  );
}