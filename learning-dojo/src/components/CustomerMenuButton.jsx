import React from 'react';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import FlatButton from '@commercetools-uikit/flat-button';

const CustomerMenuButton = () => {
  const { navigate } = useApplicationContext();

  const handleClick = () => {
    // Adjust the URL if your Merchant Center's built-in customer menu is at a different path.
    navigate({ to: '/account/customers' });
  };

  return <FlatButton label="Go to Customers" onClick={handleClick} />;
};

export default CustomerMenuButton;
