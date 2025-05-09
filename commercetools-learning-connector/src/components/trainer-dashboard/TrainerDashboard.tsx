
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import {
  Card,
  Spacings,
  Text,
  Tag,
  SecondaryButton,
  designTokens,
} from '@commercetools-frontend/ui-kit';
import { Drawer } from '@commercetools-frontend/application-components';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  fetchCustomObjectsByContainer,
  upsertCustomObject,
  deleteCustomObject,
} from '../../api/customObjects';
import sessionsJson from '../../data/sessions.json';
import type { SessionProgress } from '../session-page/SessionPage';

// — Helpers ———————————————————————————————————————————————————————
const makeSafeKey = (email: string) =>
  email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');

type Row = { key: string; progress: SessionProgress[] };

// — Claim-access panel —————————————————————————————————————————
const ClaimTrainerAccess: React.FC<{
  isClaiming: boolean;
  onClaim: () => void;
}> = ({ isClaiming, onClaim }) => (
  <Spacings.Stack scale="l" alignItems="center" css={{ textAlign: 'center' }}>
    <Text.Headline as="h2">Trainer Dashboard</Text.Headline>
    <Text.Body>Your account does not yet have trainer access.</Text.Body>
    <SecondaryButton
      // isLoading={isClaiming}
      isDisabled={isClaiming}
      label="Claim Trainer Access"
      onClick={onClaim}
    />
  </Spacings.Stack>
);

// — Main component —————————————————————————————————————————————————
const TrainerDashboard = () => {
  const projectKey = useApplicationContext(ctx => ctx.project!.key)!;
  const userEmail  = useApplicationContext(ctx => ctx.user?.email) || '';
  const trainerKey = `trainer_${makeSafeKey(userEmail)}`;

  // 1️⃣ Declare every hook unconditionally
  const [hasAccess, setHasAccess]   = useState(false);
  const [claiming,  setClaiming]    = useState(false);
  const [rows,      setRows]        = useState<Row[]>([]);
  const [loading,   setLoading]     = useState(true);
  const [selected,  setSelected]    = useState<string | null>(null);

  // 2️⃣ Hook #1: check if the trainer access object exists
  useEffect(() => {
    if (!projectKey || !userEmail) return;
    (async () => {
      try {
        const all = await fetchCustomObjectsByContainer({
          projectKey,
          container: 'trainer-access',
        });
        if (all.find((o) => o.key === trainerKey)) {
          setHasAccess(true);
        }
      } catch {
        // ignore
      }
    })();
  }, [projectKey, userEmail, trainerKey]);

  // 3️⃣ Hook #2: load participants only once access is granted
  useEffect(() => {
    if (!hasAccess) return;      // ← guard inside the hook
    setLoading(true);
    (async () => {
      try {
        const all = await fetchCustomObjectsByContainer({
          projectKey,
          container: 'participants-progress',
        });
        setRows(
          all.map((obj) => ({
            key: obj.id,
            progress: (obj.value as any).participantProgressData,
          }))
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [projectKey, hasAccess]);

  // 4️⃣ Now you can safely early-return the “claim access” UI
  if (!hasAccess) {
    return (
      <ClaimTrainerAccess
        isClaiming={claiming}
        onClaim={async () => {
          setClaiming(true);
          await upsertCustomObject({
            projectKey,
            container: 'trainer-access',
            key: trainerKey,
            value: { claimedAt: new Date().toISOString() },
          });
          setHasAccess(true);
        }}
      />
    );
  }

  // 5️⃣ And finally your full dashboard rendering,
  //    with Drawer, table, selected details, etc.
  if (loading) return <div>Loading…</div>;
  if (!rows.length) return <div>No participants found.</div>;

  // Grand totals
  const totalDecisions = sessionsJson.sessions.reduce(
    (sum, s) => sum + s.keyDecisions.length,
    0
  );
  const totalQuizzes = sessionsJson.sessions.filter((s) => !!s.quiz).length;
  const totalCases = sessionsJson.sessions.reduce(
    (sum, s) => sum + s.case_studies.length,
    0
  );

  // Layout: two panels, list + sliding drawer
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: 1fr;
        gap: ${designTokens.spacingL};
        @media (min-width: 800px) {
          grid-template-columns: 1fr;
        }
      `}
    >
      {/* Participant table */}
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
          {rows.map(({ key, progress }) => {
            const doneD = progress.reduce(
              (acc, s) => acc + s.keyDecisions.filter((kd) => kd.status === 'Completed').length,
              0
            );
            const doneQ = progress.filter((s) => s.quizStatus === 'Completed').length;
            const doneC = progress.reduce(
              (acc, s) => acc + s.case_studies.filter((cs) => cs.status === 'Completed').length,
              0
            );
            return (
              <tr
                key={key}
                onClick={() => setSelected(key)}
                style={{
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  background: selected === key ? designTokens.colorNeutral95 : undefined,
                }}
              >
                <td style={{ padding: 8 }}>{key}</td>
                <td style={{ padding: 8 }}>
                  {doneD}/{totalDecisions}
                </td>
                <td style={{ padding: 8 }}>
                  {doneQ}/{totalQuizzes}
                </td>
                <td style={{ padding: 8 }}>
                  {doneC}/{totalCases}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Sliding Drawer */}
      <Drawer
        isOpen={Boolean(selected)}
        title={selected || ''}
        onClose={() => setSelected(null)}
        size={20}
      >
        {selected && (
          <Spacings.Stack scale="m">
            <Spacings.Inline justifyContent="space-between">
              <Text.Headline as="h2">{selected}</Text.Headline>
              <SecondaryButton
                label="Reset Progress"
                onClick={async () => {
                  if (
                    window.confirm(
                      `Really reset all progress for “${selected}”?`
                    )
                  ) {
                    await deleteCustomObject({
                      projectKey,
                      container: 'participants-progress',
                      key: selected,
                    });
                    setRows((rs) => rs.filter((r) => r.key !== selected));
                    setSelected(null);
                  }
                }}
              />
            </Spacings.Inline>

            {rows
              .find((r) => r.key === selected)!.progress.map((sess) => {
                const decDone = sess.keyDecisions.filter((kd) => kd.status === 'Completed').length;
                const quizDone = sess.quizStatus === 'Completed';
                const caseDone = sess.case_studies.filter((cs) => cs.status === 'Completed').length;
                return (
                  <Card
                    key={sess.id}
                    insetScale="s"
                    css={css`
                      display: grid;
                      grid-template-columns: 1fr auto;
                      gap: ${designTokens.spacingM};
                      margin-bottom: ${designTokens.spacingM};
                    `}
                  >
                    <Spacings.Stack scale="xs">
                      <Text.Subheadline as="h4">{sess.title}</Text.Subheadline>
                      <Spacings.Inline scale="xs">
                        <Tag tone={decDone === sess.keyDecisions.length ? 'primary' : 'warning'}>
                          Decisions {decDone}/{sess.keyDecisions.length}
                        </Tag>
                        <Tag tone={quizDone ? 'primary' : 'warning'}>
                          Quiz {quizDone ? '✔' : '✘'}
                        </Tag>
                        <Tag tone={caseDone === sess.case_studies.length ? 'primary' : 'warning'}>
                          Cases {caseDone}/{sess.case_studies.length}
                        </Tag>
                      </Spacings.Inline>
                    </Spacings.Stack>
                  </Card>
                );
              })}
          </Spacings.Stack>
        )}
      </Drawer>
    </div>
  );
};

export default TrainerDashboard;
