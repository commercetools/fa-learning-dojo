// // // // src/components/load-tasks/ParticipantsProgressTable.tsx
// // import React, { useEffect, useState } from 'react';
// // import {
// //   Spacings,
// //   Text,
// //   LoadingSpinner,
// // } from '@commercetools-frontend/ui-kit';
// // import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
// // import { executeHttpClientRequest, buildApiUrl } from '@commercetools-frontend/application-shell';
// // import axios from 'axios';
// // import createHttpUserAgent from '@commercetools/http-user-agent';



// // type Session = {
// //   id: number;
// //   keyDecisions: Array<{ decisionId: number }>;
// //   quiz: string;
// //   case_studies: Array<any>;
// // };
// // type SessionProgress = Session & {
// //   keyDecisions: Array<{ status: 'Completed' | 'Not Started' }>;
// //   quizStatus: 'Completed' | 'Not Started';
// //   case_studies: Array<{ status: 'Completed' | 'Not Started' }>;
// // };
// // type ParticipantProgress = {
// //   participantProgressData: SessionProgress[];
// // };

// // type ParticipantRow = {
// //   key: string;
// //   progress: ParticipantProgress;
// // };

// // const ParticipantsProgressTable: React.FC = () => {
// //   const projectKey = useApplicationContext(ctx => ctx.project!.key)!;
// //   const [rows, setRows] = useState<ParticipantRow[] | null>(null);
// //   const [error, setError] = useState<string | null>(null);

// //   // helper fetcher
// //   const userAgent = createHttpUserAgent({
// //     name: 'participants-progress-table',
// //     version: '1.0.0',
// //     libraryName: 'fa-learning-dojo',      // <-- your app’s name
// //     contactEmail: 'support@your-company.com',
// //   });
// //   const fetcher = async (url: string) => {
// //     const result = await executeHttpClientRequest(
// //       async options => {
// //         const res = await axios(buildApiUrl(url), {
// //           headers: options.headers,
// //           withCredentials: options.credentials === 'include',
// //         });
// //         return {
// //           data: res.data,
// //           statusCode: res.status,
// //           getHeader: (name: string) => res.headers[name.toLowerCase()],
// //         };
// //       },
// //       { userAgent }
// //     );
// //     return result.data;
// //   };

// //   useEffect(() => {
// //     const loadAll = async () => {
// //       try {
// //         // 1) fetch all custom objects in that container
// //         const page = await fetcher(
// //           `/proxy/ctp/${projectKey}/custom-objects?container=participants-progress&limit=500`
// //         );
// //         // page.results: Array<{ key: string; value: ParticipantProgress }>
// //         const data: ParticipantRow[] = page.results.map((obj: any) => ({
// //           key: obj.key,
// //           progress: obj.value as ParticipantProgress,
// //         }));
// //         setRows(data);
// //       } catch (err: any) {
// //         console.error(err);
// //         setError('Failed to load participants.');
// //       }
// //     };
// //     loadAll();
// //   }, [projectKey]);

// //   if (error) {
// //     return <Text.Body>{error}</Text.Body>;
// //   }
// //   if (!rows) {
// //     return <LoadingSpinner />;
// //   }
// //   if (rows.length === 0) {
// //     return <Text.Body>No participants have been registered yet.</Text.Body>;
// //   }

// //   // compute totals from the first row’s shape
// //   const totalDecisions = rows[0].progress.participantProgressData.reduce(
// //     (sum, sess) => sum + sess.keyDecisions.length,
// //     0
// //   );
// //   const totalQuizzes = rows[0].progress.participantProgressData.filter(
// //     sess => !!sess.quizStatus
// //   ).length;
// //   const totalCases = rows[0].progress.participantProgressData.reduce(
// //     (sum, sess) => sum + sess.case_studies.length,
// //     0
// //   );

// //   return (
// //     <Spacings.Inset scale="l">
// //       <Text.Headline as="h2">Participants Progress</Text.Headline>
// //       <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
// //         <thead>
// //           <tr>
// //             <th style={{ textAlign: 'left', padding: 8 }}>Participant Key</th>
// //             <th style={{ textAlign: 'right', padding: 8 }}>Decisions</th>
// //             <th style={{ textAlign: 'right', padding: 8 }}>Quizzes</th>
// //             <th style={{ textAlign: 'right', padding: 8 }}>Case Studies</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {rows.map(({ key, progress }) => {
// //             const completedDecisions = progress.participantProgressData.reduce(
// //               (sum, sess) =>
// //                 sum + sess.keyDecisions.filter(kd => kd.status === 'Completed').length,
// //               0
// //             );
// //             const completedQuizzes = progress.participantProgressData.filter(
// //               sess => sess.quizStatus === 'Completed'
// //             ).length;
// //             const completedCases = progress.participantProgressData.reduce(
// //               (sum, sess) =>
// //                 sum + sess.case_studies.filter(cs => cs.status === 'Completed').length,
// //               0
// //             );
// //             return (
// //               <tr key={key} style={{ borderTop: '1px solid #ddd' }}>
// //                 <td style={{ padding: 8 }}>{key}</td>
// //                 <td style={{ padding: 8, textAlign: 'right' }}>
// //                   {completedDecisions}/{totalDecisions}
// //                 </td>
// //                 <td style={{ padding: 8, textAlign: 'right' }}>
// //                   {completedQuizzes}/{totalQuizzes}
// //                 </td>
// //                 <td style={{ padding: 8, textAlign: 'right' }}>
// //                   {completedCases}/{totalCases}
// //                 </td>
// //               </tr>
// //             );
// //           })}
// //         </tbody>
// //       </table>
// //     </Spacings.Inset>
// //   );
// // };

// // export default ParticipantsProgressTable;

// // src/components/load-tasks/ParticipantsProgressTable.tsx

// // src/components/participant-progress/ParticipantProgressTable.tsx
// import React, { useEffect, useState } from 'react';
// import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
// import { fetchCustomObjectsByContainer } from '../../api/customObjects';
// import sessionsJson from '../../data/sessions.json';

// type SessionShape = typeof sessionsJson.sessions[0];
// type SessionProgress = {
//   id: number;
//   keyDecisions: Array<{ status: 'Not Started' | 'Completed' }>;
//   quizStatus: 'Not Started' | 'Completed';
//   case_studies: Array<{ status: 'Not Started' | 'Completed' }>;
// };

// interface ParticipantObject {
//   key: string;               // your “name” field
//   value: {
//     participantProgressData: SessionProgress[];
//   };
// }

// export const ParticipantProgressTable: React.FC = () => {
//   const projectKey = useApplicationContext(ctx => ctx.project!.key)!;
//   const [loading, setLoading] = useState(true);
//   const [participants, setParticipants] = useState<ParticipantObject[]>([]);

//   const masterSessions: SessionShape[] = sessionsJson.sessions;
//   const totalDecisions = masterSessions.reduce(
//     (sum, s) => sum + s.keyDecisions.length,
//     0
//   );
//   const totalQuizzes = masterSessions.filter((s) => !!s.quiz).length;
//   const totalCases = masterSessions.reduce(
//     (sum, s) => sum + s.case_studies.length,
//     0
//   );

//   useEffect(() => {
//     const loadAll = async () => {
//       setLoading(true);
//       try {
//         const { results } = await fetchCustomObjectsByContainer({
//           projectKey,
//           container: 'participants-progress',
//         });
//         // results: Array of CustomObject { key, value, ... }
//         setParticipants(results as ParticipantObject[]);
//       } catch (err) {
//         console.error('Failed to load participants:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadAll();
//   }, [projectKey]);

//   if (loading) return <div>Loading participants…</div>;
//   if (!participants.length) return <div>No participants found.</div>;

//   return (
//     <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//       <thead>
//         <tr style={{ textAlign: 'left', borderBottom: '2px solid #ccc' }}>
//           <th style={{ padding: '8px' }}>Participant</th>
//           <th style={{ padding: '8px' }}>Decisions</th>
//           <th style={{ padding: '8px' }}>Quizzes</th>
//           <th style={{ padding: '8px' }}>Case Studies</th>
//         </tr>
//       </thead>
//       <tbody>
//         {participants.map(({ key, value }) => {
//           const sessions = value.participantProgressData;
//           const completedDecisions = sessions.reduce(
//             (sum, sess) =>
//               sum + sess.keyDecisions.filter((kd) => kd.status === 'Completed').length,
//             0
//           );
//           const completedQuizzes = sessions.filter((sess) => sess.quizStatus === 'Completed').length;
//           const completedCases = sessions.reduce(
//             (sum, sess) =>
//               sum + sess.case_studies.filter((cs) => cs.status === 'Completed').length,
//             0
//           );
//           return (
//             <tr key={key} style={{ borderBottom: '1px solid #eee' }}>
//               <td style={{ padding: '8px' }}>{key}</td>
//               <td style={{ padding: '8px' }}>
//                 {completedDecisions} / {totalDecisions}
//               </td>
//               <td style={{ padding: '8px' }}>
//                 {completedQuizzes} / {totalQuizzes}
//               </td>
//               <td style={{ padding: '8px' }}>
//                 {completedCases} / {totalCases}
//               </td>
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   );
// };

// export default ParticipantProgressTable;

// src/components/participant-progress/ParticipantsProgressTable.tsx
import React, { useEffect, useState } from 'react';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { fetchCustomObjectsByContainer } from '../../api/customObjects';
import sessionsJson from '../../data/sessions.json';
import type { SessionProgress } from '../session-page/SessionPage';

export const ParticipantsProgressTable: React.FC = () => {
  const projectKey = useApplicationContext((ctx) => ctx.project!.key)!;
  const [rows, setRows] = useState<
    Array<{ participant: string; progress: SessionProgress[] }>
  >([]);
  const [loading, setLoading] = useState(true);

  // pre‐compute totals
  const totalDecisions = sessionsJson.sessions.reduce(
    (sum, s) => sum + s.keyDecisions.length,
    0
  );
  const totalQuizzes = sessionsJson.sessions.filter((s) => !!s.quiz).length;
  const totalCases = sessionsJson.sessions.reduce(
    (sum, s) => sum + s.case_studies.length,
    0
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const all = await fetchCustomObjectsByContainer({
          projectKey,
          container: 'participants-progress',
        });
        const data = all.map((obj) => ({
          participant: obj.key,
          progress: (obj.value as any).participantProgressData as SessionProgress[],
        }));
        setRows(data);
      } catch (err) {
        console.error('Failed to load participants:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [projectKey]);

  if (loading) return <div>Loading participants…</div>;
  if (!rows.length) return <div>No participants found.</div>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ padding: 8, textAlign: 'left' }}>Participant</th>
          <th style={{ padding: 8, textAlign: 'left' }}>Decisions</th>
          <th style={{ padding: 8, textAlign: 'left' }}>Quizzes</th>
          <th style={{ padding: 8, textAlign: 'left' }}>Cases</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ participant, progress }) => {
          const doneDecisions = progress.reduce(
            (sum, sess) =>
              sum + sess.keyDecisions.filter((kd) => kd.status === 'Completed').length,
            0
          );
          const doneQuizzes = progress.filter((sess) => sess.quizStatus === 'Completed').length;
          const doneCases = progress.reduce(
            (sum, sess) =>
              sum + sess.case_studies.filter((cs) => cs.status === 'Completed').length,
            0
          );
          return (
            <tr key={participant} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8 }}>{participant}</td>
              <td style={{ padding: 8 }}>
                {doneDecisions} / {totalDecisions}
              </td>
              <td style={{ padding: 8 }}>
                {doneQuizzes} / {totalQuizzes}
              </td>
              <td style={{ padding: 8 }}>
                {doneCases} / {totalCases}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ParticipantsProgressTable;