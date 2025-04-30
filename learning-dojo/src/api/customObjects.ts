import axios from 'axios';
import createHttpUserAgent from '@commercetools/http-user-agent';
import { buildApiUrl, executeHttpClientRequest } from '@commercetools-frontend/application-shell';
import { ParticipantsProgressTable } from '../components/load-tasks/ParticipantsProgressTable';

const projectKey = process.env.REACT_APP_CT_PROJECT_KEY!;
const userAgent = createHttpUserAgent({ name: 'fa-course-app-client', version: '1.0.0', libraryName: window.app?.applicationName || 'fa-course-app', contactEmail: 'support@my-company.com' });

export const fetchCustomObject = async ({
  projectKey,
  container,
  key,
}: {
  projectKey: string;
  container: string;
  key: string;
}) => {
  const response = await executeHttpClientRequest(
    async (options) => {
      const res = await axios(
        buildApiUrl(
          `/proxy/ctp/${projectKey}/custom-objects/${container}/${key}`
        ),
        { method: 'GET', headers: options.headers, withCredentials: options.credentials === 'include' }
      );
      return { data: res.data, statusCode: res.status, getHeader: (h) => res.headers[h] };
    },
    { userAgent }
  );
  return response.data;
};

export const upsertCustomObject = async ({
  projectKey,
  container,
  key,
  value,
}: {
  projectKey: string;
  container: string;
  key: string;
  value: unknown;
}) => {
  const draft = { container, key, value };
  const response = await executeHttpClientRequest(
    async (options) => {
      const res = await axios(
        buildApiUrl(`/proxy/ctp/${projectKey}/custom-objects`),
        {
          method: 'POST',
          data: draft,
          headers: {
            ...options.headers,
            'Content-Type': 'application/json',
            'X-Project-Key': projectKey,
          },
          withCredentials: options.credentials === 'include',
        }
      );
      return { data: res.data, statusCode: res.status, getHeader: (h) => res.headers[h] };
    },
    { userAgent }
  );
  return response.data;
};

export const fetchCustomObjectsByContainer = async ({
  projectKey,
  container,
}: {
  projectKey: string;
  container: string;
}) => {
  const response = await executeHttpClientRequest(
    async (options) => {
      const res = await axios(buildApiUrl(`/proxy/ctp/${projectKey}/custom-objects`), {
        method: 'GET',
        headers: options.headers,
        withCredentials: options.credentials === 'include',
        params: {
          where: `container="${container}"`,
          limit: 500,
        },
      });
      return {
        data: res.data,
        statusCode: res.status,
        getHeader: (h: string) => res.headers[h],
      };
    },
    { userAgent }
  );

  const body = response.data;
  // If MC-proxy returned a bare array, use it directly:
  if (Array.isArray(body)) {
    return body;
  }
  // If we got the normal CTP envelope, unwrap it:
  if (body && Array.isArray((body as any).results)) {
    return (body as any).results;
  }
  console.error('Unexpected list-by-container response', body);
  throw new Error(
    `Unexpected response from list custom-objects: ${JSON.stringify(body)}`
  );
};
