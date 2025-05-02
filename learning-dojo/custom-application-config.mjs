import { PERMISSIONS, entryPointUriPath } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'learning-dojo',
  entryPointUriPath: '${env:ENTRY_POINT_URI_PATH}',
  cloudIdentifier: 'gcp-eu',
  env: {
    development: {
      initialProjectKey: 'ecoliving-home-lifestyle-dryrun-0424',
    },
    production: {
      applicationId: '${env:CUSTOM_APPLICATION_ID}',
      url: '${env:APPLICATION_URL}',
    },
  },
  oAuthScopes: {
    view: ['view_key_value_documents'],
    manage: ['manage_key_value_documents'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Learning DOJO',
    labelAllLocales: [],
    permissions: [PERMISSIONS.Manage],
  },
  submenuLinks: [
    {
      uriPath: 'trainer-dashboard', 
      defaultLabel: 'Trainer Dashboard (Only Visible to Trainer))',
      labelAllLocales: [],
      permissions: [PERMISSIONS.Manage],
    },
    {
      uriPath: 'session1', 
      defaultLabel: '1 - Composable Commerce Essentials',
      permissions: [PERMISSIONS.Manage],
    },
    {
      uriPath: 'session2', 
      defaultLabel: '2 - Product Modeling & Configuration',
      permissions: [PERMISSIONS.Manage],
    },
    {
      uriPath: 'session3', 
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
