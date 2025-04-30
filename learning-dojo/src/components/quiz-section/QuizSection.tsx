import React from 'react';
import { PrimaryButton as Button, Spacings } from '@commercetools-frontend/ui-kit';

interface QuizSectionProps { link: string; status: 'Not Started' | 'Completed'; onDone: () => Promise<void>; }
export const QuizSection: React.FC<QuizSectionProps> = ({ link, status, onDone }) => (

  <Spacings.Inset scale="l">
  <div style={{ margin: '16px 0' }}>
    {/* <h3>Quiz</h3> */}
    <a href={link} target="_blank" rel="noreferrer">Take Quiz</a>
    {status === 'Completed' ? <em style={{ marginLeft: '8px' }}>Completed</em> : <Button label="Done" onClick={onDone} style={{ marginLeft: '8px' }} />}
  </div>
  </Spacings.Inset>
);