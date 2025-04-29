// src/utils/fetcher.js (example)
import axios from 'axios';
import createHttpUserAgent from '@commercetools/http-user-agent';
import { buildApiUrl, executeHttpClientRequest } from '@commercetools-frontend/application-shell';

const userAgent = createHttpUserAgent({
  name: 'axios-client',
  version: '1.0.0',
  libraryName: window.app?.applicationName || 'my-app',
  contactEmail: 'support@my-company.com',
});

export const fetcher = async (url, config = {}) => {
  const data = await executeHttpClientRequest(
    async (options) => {
      const res = await axios(buildApiUrl(url), {
        ...config,
        headers: options.headers,
        withCredentials: options.credentials === 'include',
      });
      return {
        data: res.data,
        statusCode: res.status,
        getHeader: (key) => res.headers[key],
      };
    },
    { userAgent, headers: config.headers }
  );
  return data;
};
