import React, { useState } from 'react';
import QuickStartGuideHeader from './QuickStartGuideHeader';
import QuickStartGuideStep from './QuickStartGuideStep';
import {
  PrimaryButton,
  SecondaryButton,
  Spacings,
} from '@commercetools-frontend/ui-kit';
import { designTokens } from '@commercetools-frontend/ui-kit';
import { css } from '@emotion/react';

type Option = { text: string; isCorrect: boolean; feedback: string };
type Decision = {
  decisionId: number;
  title: string;
  scenario: string; // may contain <b>…</b>
  options: Option[];
  status: 'Not Started' | 'Completed';
  selectedOptionIndex?: number;
};
type Props = {
  items: Decision[];
  onSubmit: (decisionId: number, optionIndex: number) => Promise<void>;
  onReSubmit: (decisionId: number) => void;
};

export const KeyDecisionsCollapsible: React.FC<Props> = ({
  items,
  onSubmit,
  onReSubmit,
}) => {
  const [, forceUpdate] = useState(0);
  // Start with the first Not Started open:
  const [openId, setOpenId] = useState<number | null>(
    items.find((d) => d.status === 'Not Started')?.decisionId ?? null
  );

  const completedCount = items.filter((d) => d.status === 'Completed').length;
  const total = items.length;
  const percent = Math.round((completedCount / total) * 100);

  return (
    <div>
      {/* Overall header */}
      <QuickStartGuideHeader
        content="Key Decisions"
        progress={percent}
        onToggle={() =>
          setOpenId(openId === null ? items[0]?.decisionId : null)
        }
        isOpen={openId !== null}
      />

      {items.map((dec) => {
        const isEditing = openId === dec.decisionId;
        // collapse if not editing AND not completed; completed steps stay expanded
        const isClosed = dec.status !== 'Completed' && !isEditing;

        return (
          <QuickStartGuideStep
            key={dec.decisionId}
            header={dec.decisionId + '. ' + dec.title}
            isCompleted={dec.status === 'Completed'}
            isClosed={isClosed}
            // only allow header-click toggle when not completed
            onToggle={() => {
              if (dec.status !== 'Completed') {
                setOpenId(isEditing ? null : dec.decisionId);
              }
            }}
            illustration={null as any}
          >
            <div
              css={css`
                & label {
                  display: block;
                  margin: ${designTokens.spacingXs} 0;
                }
                & input[type='radio'] {
                  accent-color: ${designTokens.colorPrimary};
                  width: 1.1em;
                  height: 1.1em;
                }
              `}
            >
              {/* If this decision is completed and we're NOT in edit mode,
                  show only the Re-submit button */}
              {dec.status === 'Completed' && !isEditing ? (
                <div
                  css={css`
                    margin: ${designTokens.spacingM} 0;
                  `}
                >
                  <SecondaryButton
                    label="Re-submit"
                    onClick={() => {
                      onReSubmit(dec.decisionId);
                      // open back up for editing
                      setOpenId(dec.decisionId);
                    }}
                  />
                </div>
              ) : (
                // Otherwise show full scenario + options + Submit
                <>
                  {/* Scenario */}
                  <div
                    css={css`
                      margin-bottom: ${designTokens.spacingM};
                    `}
                    dangerouslySetInnerHTML={{ __html: dec.scenario }}
                  />

                  {/* Options */}
                  <Spacings.Stack scale="s">
                    {dec.options.map((opt, idx) => (
                      <label key={idx}>
                        <input
                          type="radio"
                          name={`decision-${dec.decisionId}`}
                          checked={dec.selectedOptionIndex === idx}
                          onChange={() => {
                            dec.selectedOptionIndex = idx;
                            forceUpdate((n) => n + 1);
                          }}
                        />{' '}
                        <span
                          dangerouslySetInnerHTML={{ __html: opt.text }}
                        />
                      </label>
                    ))}
                  </Spacings.Stack>

                  {/* Submit or Re-submit inside full view */}
                  <div
                    css={css`
                      margin-top: ${designTokens.spacingM};
                    `}
                  >
                    {dec.status === 'Completed' ? (
                      <SecondaryButton
                        label="Re-submit"
                        onClick={() => {
                          onReSubmit(dec.decisionId);
                          setOpenId(dec.decisionId);
                        }}
                      />
                    ) : (
                      <PrimaryButton
                        label="Submit"
                        onClick={async () => {
                          await onSubmit(
                            dec.decisionId,
                            dec.selectedOptionIndex ?? 0
                          );
                          // after submit, close away the full view
                          setOpenId(null);
                        }}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </QuickStartGuideStep>
        );
      })}
    </div>
  );
};
