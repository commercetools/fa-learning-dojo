import { type ReactElement } from 'react';
import type { TLeadingIconProps } from '@commercetools-uikit/icons/dist/declarations/src/leading-icon/leading-icon';
import LeadingIcon from '@commercetools-uikit/icons/leading-icon';
import { Card, Grid, Spacings, Text } from '@commercetools-frontend/ui-kit';

type IconCardProps = {
  icon: ReactElement;
  header: string;
  content: string;
  to: string;
  color: TLeadingIconProps['color'];
};

const IconCard = ({ icon, header, content, to, color }: IconCardProps) => {
  return (
    <Card to={to} insetScale="m" isExternalLink>
      <Grid gridTemplateColumns="40px 1fr" gridColumnGap="16px">
        <LeadingIcon color={color} icon={icon} size="30" />
        <Spacings.Stack scale="xs">
          <Text.Subheadline as="h4">{header}</Text.Subheadline>
          <Text.Body tone="secondary">{content}</Text.Body>
        </Spacings.Stack>
      </Grid>
    </Card>
  );
};
export default IconCard;