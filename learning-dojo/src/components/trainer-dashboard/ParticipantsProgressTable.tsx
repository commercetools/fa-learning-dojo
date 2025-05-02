
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