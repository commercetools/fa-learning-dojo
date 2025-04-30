// // src/components/session-page/SessionSteps.tsx
// import React, { useState } from 'react';
// import { Spacings, CollapsibleMotion, Text, PrimaryButton } from '@commercetools-frontend/ui-kit';
// import QuickStartGuideStep from '../quick-start-guide/quick-start-guide-step';
// import { SessionOverview } from './SessionOverview';
// import { KeyDecisionsCollapsible } from '../key-decisions/KeyDecisionsCollapsible';
// import { QuizSection } from '../quiz-section/QuizSection';
// import { CaseStudies } from '../case-studies/CaseStudies';
// import { NotesEditor } from '../notes-editor/NotesEditor';

// type Props = {
//   session: {
//     id: number;
//     overview: string;
//     keyDecisions: any[];
//     quiz: string;
//     case_studies: any[];
//   };
//   current: {
//     keyDecisions: any[];
//     quizStatus: string;
//     case_studies: any[];
//     notes: string;
//   };
//   handlers: {
//     onDecisionSubmit: (id: number, idx: number) => void;
//     onDecisionReSubmit: (id: number) => void;
//     onQuizDone: () => void;
//     onCaseStudyDone: (idx: number) => void;
//     onSaveNotes: (notes: string) => void;
//   };
// };

// export const SessionSteps: React.FC<Props> = ({
//   session,
//   current,
//   handlers,
// }) => {
//   // Track which step is open
//   const stepIds = ['overview','keyDecisions','quiz','caseStudies','notes'] as const;
//   const [openStep, setOpenStep] = useState<typeof stepIds[number]>(stepIds[0]);

//   const toggle = (step: typeof stepIds[number]) =>
//     setOpenStep(openStep === step ? '' : step);

//   return (
//     <Spacings.Stack scale="l">
//       {/* Overview */}
//       <QuickStartGuideStep
//         header="Overview"
//         isCompleted={false}
//         isClosed={openStep !== 'overview'}
//         onToggle={() => toggle('overview')}
//         illustration={null as any}
//       >
//         <SessionOverview overview={session.overview} />
//       </QuickStartGuideStep>

//       {/* Key Decisions (nested radio group) */}
//       <QuickStartGuideStep
//         header="Key Decisions"
//         isCompleted={
//           current.keyDecisions.every((d) => d.status === 'Completed')
//         }
//         isClosed={openStep !== 'keyDecisions'}
//         onToggle={() => toggle('keyDecisions')}
//         illustration={null as any}
//       >
//         <KeyDecisionsCollapsible
//           items={current.keyDecisions}
//           onSubmit={handlers.onDecisionSubmit}
//           onReSubmit={handlers.onDecisionReSubmit}
//         />
//       </QuickStartGuideStep>

//       {/* Quiz */}
//       <QuickStartGuideStep
//         header="Quiz"
//         isCompleted={current.quizStatus === 'Completed'}
//         isClosed={openStep !== 'quiz'}
//         onToggle={() => toggle('quiz')}
//         illustration={null as any}
//       >
//         <QuizSection
//           link={session.quiz}
//           status={current.quizStatus}
//           onDone={handlers.onQuizDone}
//         />
//       </QuickStartGuideStep>

//       {/* Case Studies */}
//       <QuickStartGuideStep
//         header="Case Studies"
//         isCompleted={current.case_studies.every((cs) => cs.status === 'Completed')}
//         isClosed={openStep !== 'caseStudies'}
//         onToggle={() => toggle('caseStudies')}
//         illustration={null as any}
//       >
//         <CaseStudies
//           items={current.case_studies}
//           onUpdate={handlers.onCaseStudyDone}
//         />
//       </QuickStartGuideStep>

//       {/* Notes */}
//       <QuickStartGuideStep
//         header="Notes"
//         isCompleted={false}
//         isClosed={openStep !== 'notes'}
//         onToggle={() => toggle('notes')}
//         illustration={null as any}
//       >
//         <NotesEditor
//           notes={current.notes}
//           onSave={handlers.onSaveNotes}
//         />
//       </QuickStartGuideStep>
//     </Spacings.Stack>
//   );
// };
