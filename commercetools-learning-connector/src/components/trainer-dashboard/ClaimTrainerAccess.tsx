
import React from 'react';
import { SecondaryButton, Spacings, Text } from '@commercetools-frontend/ui-kit';

type Props = {
  onClaim: () => void;
  isClaiming: boolean;
};

const ClaimTrainerAccess: React.FC<Props> = ({ onClaim, isClaiming }) => (
  <Spacings.Stack scale="l" alignItems="center">
    <Text.Headline as="h2">Trainer Dashboard</Text.Headline>
    <Text.Body>Your account does not yet have trainer access.</Text.Body>
    <SecondaryButton
      isDisabled={isClaiming}
    //   isLoading={isClaiming}
      label="Claim Trainer Access"
      onClick={onClaim}
    />
  </Spacings.Stack>
);

export default ClaimTrainerAccess;
