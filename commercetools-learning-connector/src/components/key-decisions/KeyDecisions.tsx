// src/components/key-decisions/KeyDecisions.tsx
import React, { useState } from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  RadioInput,
  Spacings,
  Text,
} from '@commercetools-frontend/ui-kit';

export interface KeyDecisionOption {
  text: string;
  feedback: string;
}

export interface KeyDecisionItem {
  decisionId: number;
  title: string;
  scenario: string;
  options: KeyDecisionOption[];
  status: 'Not Started' | 'Completed';
}

interface Props {
  items: KeyDecisionItem[];
  onSubmit: (decisionId: number, optionIndex: number) => Promise<void>;
  onReSubmit: (decisionId: number) => void;
}

export const KeyDecisions: React.FC<Props> = ({
  items,
  onSubmit,
  onReSubmit,
}) => {
  // track selected option per decision
  const [selected, setSelected] = useState<Record<number, number>>({});

  return (
    <Spacings.Stack scale="l">
      <Text.Headline as="h3">Key Decisions</Text.Headline>
      {items.map((decision) => {
        const { decisionId, title, scenario, options, status } = decision;
        const selectedValue = selected[decisionId]?.toString() ?? '';

        return (
          <div key={decisionId}>
            <Spacings.Inset scale="s">
              <Text.Subheadline as="h4">
                {decisionId}. {title}
              </Text.Subheadline>
              <div
                dangerouslySetInnerHTML={{ __html: scenario }}
                style={{ margin: '0.5em 0' }}
              />
            </Spacings.Inset>

            {status === 'Completed' ? (
              <Spacings.Inset scale="s">
                <Text.Body>✅ Decision Completed.</Text.Body>
                <SecondaryButton
                  label="Re-submit"
                  onClick={() => onReSubmit(decisionId)}
                />
              </Spacings.Inset>
            ) : (
              <Spacings.Inset scale="s">
                <RadioInput.Group
                  name={`decision-${decisionId}`}
                  value={selectedValue}
                  onChange={(e) =>
                    setSelected((prev) => ({
                      ...prev,
                      [decisionId]: Number(e.target.value),
                    }))
                  }
                >
                  {options.map((opt, idx) => (
                    <RadioInput.Option key={idx} value={idx.toString()}>
                      {opt.text}
                    </RadioInput.Option>
                  ))}
                </RadioInput.Group>

                <Spacings.Inset scale="s">
                  <PrimaryButton
                    label="Submit"
                    onClick={() =>
                      onSubmit(decisionId, selected[decisionId])
                    }
                    isDisabled={selected[decisionId] == null}
                  />
                </Spacings.Inset>
              </Spacings.Inset>
            )}
          </div>
        );
      })}
    </Spacings.Stack>
  );
};
