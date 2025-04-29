// src/components/global-progress-bar/GlobalProgressBar.tsx
import React from 'react';
import { ProgressBar, Spacings, Text } from '@commercetools-frontend/ui-kit';
import type {
  Session,
  ParticipantProgress,
  SessionProgress,
} from '../session-page/SessionPage';

interface Props {
  masterSessions: Session[];
  participantProgress: ParticipantProgress;
}

export const GlobalProgressBar: React.FC<Props> = ({
  masterSessions,
  participantProgress,
}) => {
  // guard if something’s missing
  const sessionsData: SessionProgress[] =
    participantProgress?.participantProgressData ?? [];

  const totalDecisions = masterSessions.reduce(
    (sum, s) => sum + (s.keyDecisions?.length ?? 0),
    0
  );
  const completedDecisions = sessionsData.reduce(
    (sum, p) =>
      sum +
      (p.keyDecisions?.filter((kd) => kd.status === 'Completed').length ?? 0),
    0
  );

  const totalQuizzes = masterSessions.filter((s) => !!s.quiz).length;
  const completedQuizzes = sessionsData.filter(
    (p) => p.quizStatus === 'Completed'
  ).length;

  const totalCases = masterSessions.reduce(
    (sum, s) => sum + (s.case_studies?.length ?? 0),
    0
  );
  const completedCases = sessionsData.reduce(
    (sum, p) =>
      sum +
      (p.case_studies?.filter((cs) => cs.status === 'Completed').length ?? 0),
    0
  );

  const totalItems = totalDecisions + totalQuizzes + totalCases;
  const completedItems = completedDecisions + completedQuizzes + completedCases;
  const percent =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <Spacings.Inset scale="l">
      <Text.Headline as="h3">Overall Progress</Text.Headline>
      <ProgressBar progress={percent} label={`${percent}%`} />
      <Text.Body>
        Decisions: {completedDecisions}/{totalDecisions} | Quizzes:{' '}
        {completedQuizzes}/{totalQuizzes} | Case Studies:{' '}
        {completedCases}/{totalCases}
      </Text.Body>
    </Spacings.Inset>
  );
};
