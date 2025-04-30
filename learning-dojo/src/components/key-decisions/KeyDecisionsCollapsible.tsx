// src/components/key-decisions/KeyDecisionsCollapsible.tsx
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
  const [openId, setOpenId] = useState<number | null>(
    items.find((d) => d.status === 'Not Started')?.decisionId ?? null
  );
  const completedCount = items.filter((d) => d.status === 'Completed').length;
  const total = items.length;
  const percent = Math.round((completedCount / total) * 100);

  return (
    <div>
      {/* Overall header with progress */}
      <QuickStartGuideHeader
        content="Key Decisions"
        progress={percent}
        onToggle={() =>
          setOpenId(openId === null ? items[0]?.decisionId : null)
        }
        isOpen={openId !== null}
      />

      {/* Each decision */}
      {items.map((dec) => (
        <QuickStartGuideStep
          key={dec.decisionId}
          header={dec.title}
          isCompleted={dec.status === 'Completed'}
          isClosed={openId !== dec.decisionId}
          onToggle={() =>
            setOpenId(openId === dec.decisionId ? null : dec.decisionId)
          }
          illustration={null as any}
        >
          <div
            css={css`
              /* breathing room for labels */
              & label {
                display: block;
                margin: ${designTokens.spacingXs} 0;
              }
              /* style the radio dots */
              & input[type='radio'] {
                accent-color: ${designTokens.colorPrimary};
                width: 1.1em;
                height: 1.1em;
              }
            `}
          >
            {/* Scenario (HTML) */}
            <div
              css={css`
                margin-bottom: ${designTokens.spacingM};
              `}
              dangerouslySetInnerHTML={{ __html: dec.scenario }}
            />

            <Spacings.Stack scale="s">
              {dec.options.map((opt, idx) => (
                <label key={idx}>
                  <input
                    type="radio"
                    name={`decision-${dec.decisionId}`}
                    checked={dec.selectedOptionIndex === idx}
                    onChange={() => {
                      dec.selectedOptionIndex = idx;
                    }}
                  />{' '}
                  {/* Option text as HTML */}
                  <span
                    dangerouslySetInnerHTML={{ __html: opt.text }}
                  />
                </label>
              ))}
            </Spacings.Stack>

            <div
              css={css`
                margin-top: ${designTokens.spacingM};
              `}
            >
              {dec.status === 'Completed' ? (
                <SecondaryButton
                  label="Re-submit"
                  onClick={() => onReSubmit(dec.decisionId)}
                />
              ) : (
                <PrimaryButton
                  label="Submit"
                  onClick={() =>
                    onSubmit(
                      dec.decisionId,
                      dec.selectedOptionIndex ?? 0
                    )
                  }
                />
              )}
            </div>
          </div>
        </QuickStartGuideStep>
      ))}
    </div>
  );
};
