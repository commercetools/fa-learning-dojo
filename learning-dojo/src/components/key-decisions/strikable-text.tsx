import { designTokens } from '@commercetools-uikit/design-system';
import { css } from '@emotion/react';
import { Text } from '@commercetools-frontend/ui-kit';

const StrikableText = ({
  stricken,
  children,
}: {
  stricken: boolean;
  children: string;
}) => {
  return (
    <div
      css={
        stricken &&
        css`
          text-decoration: line-through;
          color: ${designTokens.colorNeutral};
          p {
            color: ${designTokens.colorNeutral};
          }
        `
      }
    >
      <Text.Body>{children}</Text.Body>
    </div>
  );
};

export default StrikableText;