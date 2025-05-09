// import { type ReactElement } from 'react';
// import { css } from '@emotion/react';
// import {
//   AngleDownIcon,
//   AngleRightIcon,
//   CheckActiveIcon,
//   CollapsibleMotion,
//   Grid,
//   Spacings,
//   designTokens,
// } from '@commercetools-frontend/ui-kit';
// import DottedCircleActive from './dotted-circle-active.react.svg';
// import DottedCircleInactive from './dotted-circle-inactive.react.svg';
// import StrikableText from './strikable-text';

// type QuickStartGuideStepHeaderProps = {
//   onToggle: () => void;
//   isCompleted: boolean;
//   isOpen: boolean;
//   content: string;
// };

// const getStepIcon = (isOpen: boolean, isCompleted: boolean) => {
//   if (isCompleted) {
//     return <CheckActiveIcon color="primary40" />;
//   }

//   if (isOpen) {
//     return <DottedCircleActive />;
//   } else {
//     return <DottedCircleInactive />;
//   }
// };

// const QuickStartGuideStepHeader = ({
//   onToggle,
//   isCompleted,
//   isOpen,
//   content,
// }: QuickStartGuideStepHeaderProps) => {
//   return (
//     <div
//       css={
//         isOpen
//           ? null
//           : css`
//               cursor: pointer;
//             `
//       }
//       onClick={onToggle}
//     >
//       <Spacings.Inset>
//         <Grid
//           gridTemplateColumns="24px minmax(0, 1fr) auto"
//           gridColumnGap={designTokens.spacingS}
//           alignItems="center"
//         >
//           <Grid.Item>
//             <div
//               css={css`
//                 display: flex;
//                 align-items: center;
//               `}
//             >
//               {getStepIcon(isOpen, isCompleted)}
//             </div>
//           </Grid.Item>
//           <Grid.Item>
//             <StrikableText stricken={isCompleted}>{content}</StrikableText>
//           </Grid.Item>
//           <Grid.Item justifySelf="end">
//             {isOpen ? (
//               <AngleDownIcon size="small" />
//             ) : (
//               <AngleRightIcon size="small" />
//             )}
//           </Grid.Item>
//         </Grid>
//       </Spacings.Inset>
//     </div>
//   );
// };

// type QuickStartGuideStepProps = {
//   isCompleted?: boolean;
//   isClosed: boolean;
//   onToggle: () => void;
//   children: ReactElement;
//   header: string;
//   illustration: ReactElement;
// };

// const QuickStartGuideStep = ({
//   isCompleted = false,
//   isClosed,
//   onToggle,
//   children,
//   header,
//   illustration,
// }: QuickStartGuideStepProps) => {
//   return (
//     <CollapsibleMotion isClosed={isClosed} onToggle={onToggle}>
//       {({ isOpen, toggle, containerStyles, registerContentNode }) => (
//         <div
//           css={
//             isOpen
//               ? css`
//                   box-shadow: 1px 1px 5px 0px #00000040;
//                   border-radius: ${designTokens.borderRadius4}
//                     ${designTokens.borderRadius8} ${designTokens.borderRadius8}
//                     ${designTokens.borderRadius4};
//                   border-left: 4px solid ${designTokens.colorPrimary};
//                 `
//               : css`
//                   border-radius: ${designTokens.borderRadius8};
//                   &:hover {
//                     background: ${designTokens.colorPrimary95};
//                   }
//                   padding-left: 4px;
//                 `
//           }
//         >
//           <QuickStartGuideStepHeader
//             content={header}
//             onToggle={toggle}
//             isCompleted={isCompleted}
//             isOpen={isOpen}
//           />
//           <div style={containerStyles}>
//             <div
//               ref={registerContentNode}
//               css={css`
//                 padding: 0 ${designTokens.spacingM} ${designTokens.spacingM}
//                   ${designTokens.spacingM};
//               `}
//             >
//               <Grid
//                 gridTemplateColumns="24px 442px 1fr"
//                 gridColumnGap={designTokens.spacingS}
//               >
//                 <Grid.Item gridColumnStart="2" gridColumnEnd="3">
//                   {children}
//                 </Grid.Item>
//                 <Grid.Item gridColumnStart="3" gridColumnEnd="4">
//                   <div
//                     css={css`
//                       width: 100%;
//                       /**
//                      * Because of the way we use CollapsibleMotion, we need to ensure
//                      * that we have a separate header component outside of the collapsible content.
//                      * This means that illustrations can only be centered along the content
//                      * column axis rather than the whole expanded height of the card, which makes them appear off.
//                      *
//                      * Instead of centering about 100% height, we subtract the header height and the container
//                      * padding to ensure even centering.
//                     */
//                       height: calc(100% - 58px + ${designTokens.spacingM});
//                       display: flex;
//                       align-items: center;
//                       justify-content: center;
//                     `}
//                   >
//                     {illustration}
//                   </div>
//                 </Grid.Item>
//               </Grid>
//             </div>
//           </div>
//         </div>
//       )}
//     </CollapsibleMotion>
//   );
// };

// export default QuickStartGuideStep;


// src/components/key-decisions/QuickStartGuideStep.tsx
import React, { type ReactElement } from 'react';
import { css } from '@emotion/react';
import {
  AngleDownIcon,
  AngleRightIcon,
  CheckActiveIcon,
  CollapsibleMotion,
  Grid,
  Spacings,
  designTokens,
} from '@commercetools-frontend/ui-kit';
import DottedCircleActive from './dotted-circle-active.react.svg';
import DottedCircleInactive from './dotted-circle-inactive.react.svg';
import StrikableText from './strikable-text';

type QuickStartGuideStepHeaderProps = {
  onToggle: () => void;
  isCompleted: boolean;
  isOpen: boolean;
  content: string;
};

const getStepIcon = (isOpen: boolean, isCompleted: boolean) => {
  if (isCompleted) return <CheckActiveIcon color="primary40" />;
  return isOpen ? <DottedCircleActive /> : <DottedCircleInactive />;
};

const QuickStartGuideStepHeader = ({
  onToggle,
  isCompleted,
  isOpen,
  content,
}: QuickStartGuideStepHeaderProps) => (
  <div
    css={
      !isOpen &&
      css`
        cursor: pointer;
      `
    }
    onClick={onToggle}
  >
    <Spacings.Inset>
      <Grid
        gridTemplateColumns="24px minmax(0, 1fr) auto"
        gridColumnGap={designTokens.spacingS}
        alignItems="center"
      >
        <Grid.Item>
          <div
            css={css`
              display: flex;
              align-items: center;
            `}
          >
            {getStepIcon(isOpen, isCompleted)}
          </div>
        </Grid.Item>
        <Grid.Item>
          <StrikableText stricken={isCompleted}>{content}</StrikableText>
        </Grid.Item>
        <Grid.Item justifySelf="end">
          {isOpen ? <AngleDownIcon size="small" /> : <AngleRightIcon size="small" />}
        </Grid.Item>
      </Grid>
    </Spacings.Inset>
  </div>
);

type QuickStartGuideStepProps = {
  isCompleted?: boolean;
  isClosed: boolean;
  onToggle: () => void;
  children: ReactElement;
  header: string;
  illustration: ReactElement;
};

const QuickStartGuideStep = ({
  isCompleted = false,
  isClosed,
  onToggle,
  children,
  header,
  illustration,
}: QuickStartGuideStepProps) => (
  <CollapsibleMotion isClosed={isClosed} onToggle={onToggle}>
    {({ isOpen, toggle, containerStyles, registerContentNode }) => (
      <div
        css={
          isOpen
            ? css`
                box-shadow: 1px 1px 5px 0px #00000040;
                border-radius: ${designTokens.borderRadius4}
                  ${designTokens.borderRadius8} ${designTokens.borderRadius8}
                  ${designTokens.borderRadius4};
                border-left: 4px solid ${designTokens.colorPrimary};
              `
            : css`
                border-radius: ${designTokens.borderRadius8};
                &:hover {
                  background: ${designTokens.colorPrimary95};
                }
                padding-left: 4px;
              `
        }
      >
        {/* Step Header */}
        <QuickStartGuideStepHeader
          content={header}
          onToggle={toggle}
          isCompleted={isCompleted}
          isOpen={isOpen}
        />

        {/* Collapsible Content */}
        <div style={containerStyles}>
          <div
            ref={registerContentNode}
            css={css`
              padding: 0 ${designTokens.spacingM} ${designTokens.spacingM}
                ${designTokens.spacingM};
            `}
          >
            <Grid
              gridTemplateColumns="24px minmax(0, 1fr) auto"
              gridColumnGap={designTokens.spacingS}
              alignItems="start"
            >
              {/* spacer column */}
              <Grid.Item gridColumnStart="1" gridColumnEnd="2" />

              {/* Content column, now FULL WIDTH */}
              <Grid.Item gridColumnStart="2" gridColumnEnd="3">
                <div
                  css={css`
                    width: 100%;
                  `}
                >
                  {children}
                </div>
              </Grid.Item>

              {/* Illustration column */}
              <Grid.Item gridColumnStart="3" gridColumnEnd="4">
                <div
                  css={css`
                    width: 100%;
                    height: calc(100% - 58px + ${designTokens.spacingM});
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  `}
                >
                  {illustration}
                </div>
              </Grid.Item>
            </Grid>
          </div>
        </div>
      </div>
    )}
  </CollapsibleMotion>
);

export default QuickStartGuideStep;
