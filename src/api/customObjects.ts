import axios from 'axios';
import createHttpUserAgent from '@commercetools/http-user-agent';
import { buildApiUrl, executeHttpClientRequest } from '@commercetools-frontend/application-shell';

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