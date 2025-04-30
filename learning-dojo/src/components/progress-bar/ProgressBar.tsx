import React from 'react';

interface ProgressBarProps {
  totalDecisions: number;
  completedDecisions: number;
  quizStatus: 'Not Started' | 'Completed' | undefined;
  caseStudiesCount: number;
  completedCaseStudies: number;
}
export const ProgressBarComponent: React.FC<ProgressBarProps> = ({ totalDecisions, completedDecisions, quizStatus, caseStudiesCount, completedCaseStudies }) => {
  const totalItems = totalDecisions + 1 + caseStudiesCount;
  const completedItems = completedDecisions + (quizStatus === 'Completed' ? 1 : 0) + completedCaseStudies;
  const percent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  return (
    <div style={{ margin: '16px 0' }}>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${percent}%` }}>{percent}%</div>
      </div>
      <div style={{ fontSize: '0.9em', marginTop: '4px' }}>
        Decisions: {completedDecisions}/{totalDecisions} | Quiz: {quizStatus} | Cases: {completedCaseStudies}/{caseStudiesCount}
      </div>
    </div>
  );
};