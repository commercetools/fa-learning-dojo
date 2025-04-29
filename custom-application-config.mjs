import { PERMISSIONS, entryPointUriPath } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Starter Typescript 1e164f',
  entryPointUriPath,
  cloudIdentifier: 'gcp-eu',
  env: {
    development: {
      initialProjectKey: 'ecoliving-home-lifestyle-dryrun-0424',
    },
    production: {
      applicationId: 'TODO',
      url: 'https://your_app_hostname.com',
    },
  },
  oAuthScopes: {
    view: ['view_products'],
    manage: ['manage_project'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Template starter',
    labelAllLocales: [],
    permissions: [PERMISSIONS.Manage],
  },
  submenuLinks: [
    {
      uriPath: 'load-tasks', // Must match your route path
      defaultLabel: 'Training Progress (Only Visible to Trainer))',
      labelAllLocales: [],
      permissions: [PERMISSIONS.Manage],
    },
    {
      uriPath: 'session1', // match your route
      defaultLabel: 'Sessions 1',
      permissions: [PERMISSIONS.Manage],
    },
    {
      uriPath: 'session2', // match your route
      defaultLabel: 'Sessions 2',
      permissions: [PERMISSIONS.Manage],
    }
  ],
};

export default config;
