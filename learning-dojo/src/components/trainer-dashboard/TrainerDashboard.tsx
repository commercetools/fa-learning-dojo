// src/components/load-tasks/TrainerDashboard.tsx
import React from 'react';
import axios from 'axios';
import createHttpUserAgent from '@commercetools/http-user-agent';
import {
  buildApiUrl,
  executeHttpClientRequest,
} from '@commercetools-frontend/application-shell';
import sessionsData from '../../data/sessions.json';
import FlatButton from '@commercetools-uikit/flat-button';
import ParticipantsProgressTable from './ParticipantsProgressTable';

// create a user agent for our HTTP client
const userAgent = createHttpUserAgent({
  name: 'fa-course-app',
  version: '1.0.0',
  libraryName: 'fa-course-app',
  contactEmail: 'support@my-company.com',
});

const projectKey = 'lifestyle-and-home-corp-0205';

/**
 * Creates (or overwrites) a single custom object in CTP.
 * @param container name of the Custom Object container
 * @param key key of the Custom Object
 * @param value the JSON payload to store
 */
const upsertCustomObject = async (
  container: string,
  key: string,
  value: unknown
) => {
  const draft = { container, key, value };

  const result = await executeHttpClientRequest(
    async (options) => {
      const res = await axios(buildApiUrl(`/proxy/ctp/${projectKey}/custom-objects`), {
        method: 'POST',
        data: draft,
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
          'X-Project-Key': projectKey,
        },
        withCredentials: options.credentials === 'include',
      });
      return {
        data: res.data,
        statusCode: res.status,
        getHeader: (name: string) => res.headers[name],
      };
    },
    { userAgent }
  );
  return result.data;
};

const TrainerDashboard = () => {
  const handleLoadSessions = async () => {
    try {
      // sessionsData is the full object { sessions: [...] }
      // we want to store the array itself
      const sessionsArray = sessionsData.sessions;

      const created = await upsertCustomObject(
        'master-tasks',   // your container
        'sessions',       // key under which all sessions are stored
        sessionsArray     // the full array of session definitions
      );
      console.log('Master sessions uploaded:', created);
      // you may want to show a success notification here
    } catch (err) {
      console.error('Failed to upload master sessions:', err);
      // you may want to show an error notification here
    }
  };

  return (
    <div>
      <FlatButton label="Load All Sessions" onClick={handleLoadSessions} />

      <ParticipantsProgressTable />
    </div>
  );
};

export default TrainerDashboard;
