// src/components/session-page/ResourceCard.tsx
import React from 'react';
import {
  Card,
  Grid,
  Spacings,
  Text,
  PrimaryButton,
  Tag,
  designTokens,
} from '@commercetools-frontend/ui-kit';
import { CheckActiveIcon } from '@commercetools-frontend/ui-kit';
import { css } from '@emotion/react';

export type DescriptionBlock = { type: string; content: string };
type ResourceCardProps = {
  icon: React.ReactNode;
  header: string;
  link: string;
  description?: DescriptionBlock[];
  status: 'Not Started' | 'Completed';
  onDone: () => Promise<void>;
};

const ResourceCard: React.FC<ResourceCardProps> = ({
  icon,
  header,
  link,
  description,
  status,
  onDone,
}) => (
  <Card to={link} isExternalLink insetScale="m">
    <Grid
      gridTemplateColumns="40px 1fr auto"
      gridColumnGap={designTokens.spacingM}
      alignItems="start"
    >
      {/* 1️⃣ Icon */}
      <div style={{ display: 'flex', alignItems: 'center' }}>{icon}</div>
      
      {/* 2️⃣ Content (title / link / description paragraphs) */}
      <div>
        <Spacings.Stack scale="xs">
          <Text.Subheadline as="h4">{header}</Text.Subheadline>
          {/* <Text.Body tone="secondary">{link}</Text.Body> */}
          {description && description!.map((block, i) => (
            <div
                key={i}
                css={css`
                margin-bottom: ${designTokens.spacingM};
                /* any other typography / spacing you want */
                `}
                dangerouslySetInnerHTML={{ __html: block.content }}
            />
            ))}
        </Spacings.Stack>
      </div>
      
      {/* 3️⃣ Action (button or “Completed” tag) */}
      <div>
        {status === 'Not Started' ? (
          <PrimaryButton
            label="View"
            onClick={(e) => {
              // prevent the Card navigation when clicking the button
              e.stopPropagation();
              onDone();
            }}
          />
        ) : (
          <Tag tone="primary">
            <CheckActiveIcon size="small" color="primary40" style={{ marginRight: '0.25em' }} />
             Completed
          </Tag>
        )}
      </div>
    </Grid>
  </Card>
);

export default ResourceCard;
