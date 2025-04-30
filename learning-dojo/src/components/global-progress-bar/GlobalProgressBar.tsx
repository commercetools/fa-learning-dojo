// // src/components/global-progress-bar/GlobalProgressBar.tsx
// import React from 'react';
// import { ProgressBar, Spacings, Text } from '@commercetools-frontend/ui-kit';
// import type {
//   Session,
//   ParticipantProgress,
//   SessionProgress,
// } from '../session-page/SessionPage';

// interface Props {
//   masterSessions: Session[];
//   participantProgress: ParticipantProgress;
// }

// export const GlobalProgressBar: React.FC<Props> = ({
//   masterSessions,
//   participantProgress,
// }) => {
//   // guard if something’s missing
//   const sessionsData: SessionProgress[] =
//     participantProgress?.participantProgressData ?? [];

//   const totalDecisions = masterSessions.reduce(
//     (sum, s) => sum + (s.keyDecisions?.length ?? 0),
//     0
//   );
//   const completedDecisions = sessionsData.reduce(
//     (sum, p) =>
//       sum +
//       (p.keyDecisions?.filter((kd) => kd.status === 'Completed').length ?? 0),
//     0
//   );

//   const totalQuizzes = masterSessions.filter((s) => !!s.quiz).length;
//   const completedQuizzes = sessionsData.filter(
//     (p) => p.quizStatus === 'Completed'
//   ).length;

//   const totalCases = masterSessions.reduce(
//     (sum, s) => sum + (s.case_studies?.length ?? 0),
//     0
//   );
//   const completedCases = sessionsData.reduce(
//     (sum, p) =>
//       sum +
//       (p.case_studies?.filter((cs) => cs.status === 'Completed').length ?? 0),
//     0
//   );

//   const totalItems = totalDecisions + totalQuizzes + totalCases;
//   const completedItems = completedDecisions + completedQuizzes + completedCases;
//   const percent =
//     totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

//   return (
//     // <Spacings.Inset scale="l">
//     //   {/* <Text.Headline as="h3">Overall Progress</Text.Headline> */}
//     //   <ProgressBar progress={percent} label={`${percent}%`} />
//     //   <Text.Body>
//     //     Decisions: {completedDecisions}/{totalDecisions} | Quizzes:{' '}
//     //     {completedQuizzes}/{totalQuizzes} | Case Studies:{' '}
//     //     {completedCases}/{totalCases}
//     //   </Text.Body>
//     // </Spacings.Inset>

//     <Spacings.Inset scale="l">
//       {/* full-width wrapper, left-aligned */}
//       <div
//         css={{
//           width: '100%',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'flex-start',
//        }}
//       >
//         <div css={{ width: '100%' }}>
//           <ProgressBar progress={percent} label={`${percent}%`} />
//         </div>
//         <Text.Body>
//           Decisions: {completedDecisions}/{totalDecisions} | Quizzes:{' '}
//           {completedQuizzes}/{totalQuizzes} | Case Studies:{' '}
//           {completedCases}/{totalCases}
//        </Text.Body>
//       </div>
//     </Spacings.Inset>
//   );
// };


//teseting
// src/components/global-progress-bar/GlobalProgressBar.tsx
import React from 'react';
import { ProgressBar, Spacings, Text } from '@commercetools-frontend/ui-kit';
import { css } from '@emotion/react';
import type {
  Session,
  ParticipantProgress,
  SessionProgress,
} from '../session-page/SessionPage';

interface Props {
  masterSessions: Session[];
  participantProgress: ParticipantProgress;
  participant: {
    name: string | null
    email: string | null,
    key: string | null
  };
}

export const GlobalProgressBar: React.FC<Props> = ({
  masterSessions,
  participantProgress,
  participant
}) => {
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
      {/* full-width wrapper */}
      <div
        css={css`
          width: 100%;
        `}
      >
         <h1>👋 Hello, {participant.name}!</h1>
        
        {/* force the bar to fill 100% */}
        <ProgressBar
          progress={percent}
          label={`${percent}%`}
          barWidth={16}
          labelPosition='left'
        />
      </div>

      {/* stats below, also left-aligned */}
      <div
        css={css`
          margin-top: ${16 /* px */}px;
          width: 100%;
          text-align: left;
        `}
      >
        <Text.Body>
          Decisions: {completedDecisions}/{totalDecisions} | Quizzes:{' '}
          {completedQuizzes}/{totalQuizzes} | Case Studies:{' '}
          {completedCases}/{totalCases}
        </Text.Body>
      </div>
    </Spacings.Inset>
  );
};
