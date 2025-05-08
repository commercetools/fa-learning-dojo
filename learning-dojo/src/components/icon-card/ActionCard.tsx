// src/components/session-page/ActionCard.tsx
import React from 'react';
import { Card, Grid, Spacings, Text, PrimaryButton, Tag, designTokens } from '@commercetools-frontend/ui-kit';
import { CheckActiveIcon } from '@commercetools-frontend/ui-kit';

type ActionCardProps = {
  header: string;
  link: string;
  status: 'Not Started' | 'Completed';
  onDone: () => Promise<void>;
  icon: React.ReactNode;
};

const ActionCard: React.FC<ActionCardProps> = ({
  header,
  link,
  status,
  onDone,
  icon,
}) => (
  <div>
    <Card to={link} isExternalLink insetScale="m">
      <Grid gridTemplateColumns="40px 1fr" gridColumnGap={designTokens.spacingM}>
        <div style={{ display: 'flex', alignItems: 'center' }}>{icon}</div>
        <Spacings.Stack scale="xs">
          <Text.Subheadline as="h4">{header}</Text.Subheadline>
          <Text.Body tone="secondary">{link}</Text.Body>
        </Spacings.Stack>
      </Grid>
    </Card>
    <div style={{ marginTop: designTokens.spacingXs }}>
      {status === 'Not Started' ? (
        <PrimaryButton label="Done" onClick={onDone} />
      ) : (
        <Tag
          tone="primary"
        //   icon={<CheckActiveIcon color="primary40" size="small" />}
        >
          Completed
        </Tag>
      )}
    </div>
  </div>
);

export default ActionCard;
