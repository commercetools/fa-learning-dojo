import { css } from '@emotion/react';
import {
  ArrowsMinimizeIcon,
  ExpandIcon,
  Avatar,
  IconButton,
  FlagFilledIcon,
  ProgressBar,
  Spacings,
  Text,
  designTokens,
} from '@commercetools-frontend/ui-kit';

type QuickStartGuideHeaderProps = {
  content: string;
  progress?: number;
  onToggle?: () => void;
  isOpen?: boolean;
};

const QuickStartGuideHeader = ({
  content,
  progress,
  onToggle,
  isOpen,
}: QuickStartGuideHeaderProps) => {
  return (
    <div
      css={css`
        width: 100%;
        display: flex;
        height: 59px;
        background: ${designTokens.colorSurface};
        border-radius: ${designTokens.borderRadius4}
          ${designTokens.borderRadius4} 0 0;
        align-items: center;
        border-bottom: ${`1px solid ${designTokens.colorNeutral90}`};
      `}
    >
      <div
        css={css`
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: ${designTokens.spacingL};
        `}
      >
        <Spacings.Inline scale="xs" alignItems="center">
          <div
            css={css`
              div {
                background-color: white;
              }
              svg {
                fill: ${designTokens.colorPrimary};
              }
            `}
          >
            <Avatar
              icon={<FlagFilledIcon />}
              gravatarHash="flag-icon"
              size="m"
              color="purple"
            />
          </div>
          <div
            css={css`
              & > h2 {
                color: ${designTokens.colorSolid};
              }
            `}
          >
            <Text.Headline as="h2">{content}</Text.Headline>
          </div>
        </Spacings.Inline>
        <Spacings.Inline alignItems="center" scale="xxl">
          <div
            css={css`
              width: ${designTokens.constraint6};
            `}
          >
            <ProgressBar progress={progress} isAnimated={false} height="10" />
          </div>
          
            <IconButton
              isToggled
              isToggleButton
              theme="default"
              icon={isOpen ? <ArrowsMinimizeIcon /> : <ExpandIcon />}
              label="icon-button"
              onClick={onToggle}
            />
        </Spacings.Inline>
      </div>
    </div>
  );
};

export default QuickStartGuideHeader;