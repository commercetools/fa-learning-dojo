import React from 'react';
import {
  Spacings,
  Text,
  PrimaryButton,
  SecondaryButton,
} from '@commercetools-frontend/ui-kit';

export type CaseStudyItem = {
  title: string;
  link: string;
  status?: 'Not Started' | 'Completed';
};

type Props = {
  /** The list of case studies for this session */
  items?: CaseStudyItem[];
  /** Called with the index when the user marks one complete */
  onUpdate: (index: number) => void;
};

export const CaseStudies: React.FC<Props> = ({ items = [], onUpdate }) => {
  // 1) Guard against no items
  if (!Array.isArray(items) || items.length === 0) {
    return null; // or: <Text.Body>No case studies for this session.</Text.Body>
  }

  return (
    <Spacings.Stack scale="l">
      <Text.Headline as="h3">Case Studies</Text.Headline>

      {items.map((cs, idx) => (
        <Spacings.Inset key={idx} scale="s">
          <Text.Subheadline as="h4">{cs.title}</Text.Subheadline>
          <div style={{ margin: '0.5em 0' }}>
            <a href={cs.link} target="_blank" rel="noopener noreferrer">
              View Case Study
            </a>
          </div>
          {cs.status === 'Completed' ? (
            <SecondaryButton
              label="Re-submit"
              onClick={() => onUpdate(idx)}
            />
          ) : (
            <PrimaryButton
              label="Mark Completed"
              onClick={() => onUpdate(idx)}
            />
          )}
        </Spacings.Inset>
      ))}
    </Spacings.Stack>
  );
};