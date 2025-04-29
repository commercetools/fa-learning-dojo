import React from 'react';
import { PrimaryButton as Button } from '@commercetools-frontend/ui-kit';

interface QuizSectionProps { link: string; status: 'Not Started' | 'Completed'; onDone: () => Promise<void>; }
export const QuizSection: React.FC<QuizSectionProps> = ({ link, status, onDone }) => (
  <div style={{ margin: '16px 0' }}>
    <h3>Quiz</h3>
    <a href={link} target="_blank" rel="noreferrer">Take Quiz</a>
    {status === 'Completed' ? <em style={{ marginLeft: '8px' }}>Completed</em> : <Button label="Done" onClick={onDone} style={{ marginLeft: '8px' }} />}
  </div>
);