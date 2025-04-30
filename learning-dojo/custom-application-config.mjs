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
    defaultLabel: 'Learning DOJO',
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
      defaultLabel: '1 - Composable Commerce Essentials',
      permissions: [PERMISSIONS.Manage],
    },
    {
      uriPath: 'session2', // match your route
      defaultLabel: '2 - Product Modeling & Configuration',
      permissions: [PERMISSIONS.Manage],
    },
    {
      uriPath: 'session3', // match your route
      defaultLabel: '3 - Advanced Product Modeling',
      permissions: [PERMISSIONS.Manage],
    },
    
    // {
    //   uriPath: 'session4', // match your route
    //   defaultLabel: 'Session 4',
    //   permissions: [PERMISSIONS.Manage],
    // },
    // {
    //   uriPath: 'session5', // match your route
    //   defaultLabel: 'Session 5',
    //   permissions: [PERMISSIONS.Manage],
    // },
    // {
    //   uriPath: 'session6', // match your route
    //   defaultLabel: 'Session 6',
    //   permissions: [PERMISSIONS.Manage],
    // },
    // {
    //   uriPath: 'session7', // match your route
    //   defaultLabel: 'Session 7',
    //   permissions: [PERMISSIONS.Manage],
    // },
    // {
    //   uriPath: 'session8', // match your route
    //   defaultLabel: 'Session 8',
    //   permissions: [PERMISSIONS.Manage],
    // },
    // {
    //   uriPath: 'session9', // match your route
    //   defaultLabel: 'Session 9',
    //   permissions: [PERMISSIONS.Manage],
    // }
  ],
};

export default config;
