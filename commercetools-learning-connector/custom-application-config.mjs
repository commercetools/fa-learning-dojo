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
      initialProjectKey: 'ecoliving-test-project',
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
    defaultLabel: 'My Learning',
    labelAllLocales: [],
    permissions: [PERMISSIONS.Manage],
  },
  submenuLinks: [
    {
      uriPath: 'trainer-dashboard', 
      defaultLabel: 'Trainer Dashboard',
      labelAllLocales: [],
      permissions: [PERMISSIONS.Manage],
    },
    {
      uriPath: 'session1', 
      defaultLabel: '1 - Intro & Essentials',
      permissions: [PERMISSIONS.Manage],
    },
    {
      uriPath: 'session2', 
      defaultLabel: '2 - Product Modeling',
      permissions: [PERMISSIONS.Manage],
    },
    {
      uriPath: 'session3', 
      defaultLabel: '3 - Advanced Modelling',
      permissions: [PERMISSIONS.Manage],
    },
    {
      uriPath: 'session4', 
      defaultLabel: '4 - Stores & Channels ',
      permissions: [PERMISSIONS.Manage],
    },
    {
      uriPath: 'session5', 
      defaultLabel: '5 - Price Configuration ',
      permissions: [PERMISSIONS.Manage],
    },
    {
      uriPath: 'session6', 
      defaultLabel: '6 - Promotions & Discounts ',
      permissions: [PERMISSIONS.Manage],
    },
    {
      uriPath: 'session7', 
      defaultLabel: '7 - Shipping & Product Search ',
      permissions: [PERMISSIONS.Manage],
    },
    {
      uriPath: 'session8', 
      defaultLabel: '8 - Checkout',
      permissions: [PERMISSIONS.Manage],
    },
    {
      uriPath: 'session9', 
      defaultLabel: '9 - Extensions & Customization ',
      permissions: [PERMISSIONS.Manage],
    }
  ],
};

export default config;
