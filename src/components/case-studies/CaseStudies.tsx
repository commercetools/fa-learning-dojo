import React from 'react';
import { PrimaryButton as Button } from '@commercetools-frontend/ui-kit';

interface CaseStudy { title: string; link: string; }
interface CaseStudiesProps { items: CaseStudy[]; onUpdate: (index: number) => Promise<void>; }
export const CaseStudies: React.FC<CaseStudiesProps> = ({ items, statusMap, onUpdate }) => (
  <div>
    <h3>Case Studies</h3>
    {items.map((cs, idx) => (
      <div key={idx} style={{ marginBottom: '12px' }}>
        <p><strong>{cs.title}</strong></p>
        <a href={cs.link} target="_blank" rel="noreferrer">View Case Study</a>
        {statusMap[idx] === 'Completed' ? <em style={{ marginLeft: '8px' }}>Completed</em> : <Button label="Done" onClick={() => onUpdate(idx)} style={{ marginLeft: '8px' }} />}
      </div>
    ))}
  </div>
);