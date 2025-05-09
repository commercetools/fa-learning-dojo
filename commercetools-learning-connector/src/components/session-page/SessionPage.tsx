import { css, Global } from '@emotion/react';
import { designTokens, Grid, SecondaryButton, Card, Text } from '@commercetools-frontend/ui-kit';
import React, { useEffect, useState } from 'react';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { Spacings } from '@commercetools-frontend/ui-kit';
import DOMPurify from 'dompurify';
import { ReviewIcon } from '@commercetools-frontend/ui-kit';
import { fetchCustomObject, upsertCustomObject } from '../../api/customObjects';
import sessionsJson from '../../data/sessions.json';

import { GlobalProgressBar } from '../global-progress-bar/GlobalProgressBar';
import RichNotesEditor from '../notes-editor/RichNotesEditor';
import { KeyDecisionsCollapsible } from '../key-decisions/KeyDecisionsCollapsible';
import { SessionHeader } from './SessionHeader';
import ResourceCard, { DescriptionBlock } from '../icon-card/ResourceCard';

// — Types ——————————————————————————————————————————————————————
export type Session = (typeof sessionsJson.sessions)[0];
export interface SessionProgress
  extends Omit<Session, 'keyDecisions' | 'case_studies'> {
  quizStatus: 'Not Started' | 'Completed';
  notes: string;
  keyDecisions: Array<
    Session['keyDecisions'][0] & {
      status: 'Not Started' | 'Completed';
      selectedOptionIndex?: number;
      feedback?: string;
    }
  >;
  case_studies: Array<
    Session['case_studies'][0] & { status: 'Not Started' | 'Completed' }
  >;
}
export interface ParticipantProgress {
  participantProgressData: SessionProgress[];
}

// — Helpers ————————————————————————————————————————————————————
const makeSafeKey = (email: string) =>
  email
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_');

const buildInitialProgress = (all: Session[]): ParticipantProgress => ({
  participantProgressData: all.map((s) => ({
    ...s,
    quizStatus: 'Not Started',
    notes: '',
    keyDecisions: s.keyDecisions.map((kd) => ({
      ...kd,
      status: 'Not Started',
    })),
    case_studies: s.case_studies.map((cs) => ({
      ...cs,
      status: 'Not Started',
    })),
  })),
});

const makeNoteEntryHtml = (
  decisionId: number,
  scenario: string,
  selected: string,
  feedback: string
) => `
  <div class="note-entry" style="margin-bottom:20px; padding:0.5rem; border:1px solid #eee;">
      <h2>📝 Decision ${decisionId}:</h2>
      <div>${scenario}</div>
      <div>• <strong>Selected:</strong> ${selected}</div>
      <div>• <strong>Feedback:</strong> ${feedback}</div>
  </div>
`;

// — Component —————————————————————————————————————————————————————
const SessionPage: React.FC<{ sessionId: number }> = ({ sessionId }) => {
  // 📌 Hooks must all go before any early return
  const projectKey = useApplicationContext((ctx) => ctx.project!.key)!;
  const userEmail = useApplicationContext((ctx) => ctx.user?.email) || '';
  const [progressData, setProgressData] = useState<ParticipantProgress | null>(
    null
  );
  const [localNotes, setLocalNotes] = useState<string>('');

  const allSessions = sessionsJson.sessions as Session[];
  const session = allSessions.find((s) => s.id === sessionId)!;
  const participantKey = makeSafeKey(userEmail);

  // 1️⃣ Load (or seed) custom‐object exactly once
  useEffect(() => {
    if (!projectKey || !userEmail) return;
    (async () => {
      try {
        const fetched = await fetchCustomObject<ParticipantProgress>({
          projectKey,
          container: 'participants-progress',
          key: participantKey,
        });
        setProgressData(fetched.value);
      } catch (err: any) {
        const status = err.response?.status || err.statusCode;
        if (status === 404) {
          const initial = buildInitialProgress(allSessions);
          await upsertCustomObject({
            projectKey,
            container: 'participants-progress',
            key: participantKey,
            value: initial,
          });
          setProgressData(initial);
        } else {
          console.error('Error loading progress:', err);
        }
      }
    })();
  }, [projectKey, userEmail]);

  // 2️⃣ Whenever we finally get fresh progressData, sync our notes-editor
  useEffect(() => {
    if (!progressData) return;
    const current = progressData.participantProgressData.find(
      (p) => p.id === sessionId
    )!;
    setLocalNotes(current.notes);
  }, [progressData, sessionId]);

  // 3️⃣ Early‐return while loading
  if (!progressData) {
    return <div>Loading your session…</div>;
  }

  // 4️⃣ Grab just this session’s progress record
  const current = progressData.participantProgressData.find(
    (p) => p.id === sessionId
  )!;

  // 5️⃣ A helper to persist the entire envelope
  const persist = async (updated: ParticipantProgress) => {
    await upsertCustomObject({
      projectKey,
      container: 'participants-progress',
      key: participantKey,
      value: updated,
    });
    setProgressData({ ...updated });
  };

  return (
    <Spacings.Stack scale="xl">
      {/* 1️⃣ Global progress bar (row 1) */}
      <GlobalProgressBar
        masterSessions={allSessions}
        participantProgress={progressData}
      />

      {/* 2️⃣ Session title */}
      <Text.Headline as="h2">Session {session.id}: {session.title}</Text.Headline>

      {/* 3️⃣ Two-column layout */}
      <Grid
        gridTemplateColumns="60% 40%"
        gridColumnGap={designTokens.spacingL}
        gridRowGap={designTokens.spacingL} 
      >
        {/* Left: Key Decisions */}
        <Card insetScale="m">
          <KeyDecisionsCollapsible
            items={current.keyDecisions}
            onSubmit={async (decisionId, idx) => {
                      const kd = current.keyDecisions.find(
                        (d) => d.decisionId === decisionId
                      )!;
                      kd.status = 'Completed';
                      kd.selectedOptionIndex = idx;
                      kd.feedback = kd.options[idx].feedback!;
            
                      // strip old block for this decision
                      current.notes = current.notes
                        .replace(
                          new RegExp(
                            `(<hr/?>)?[\\s\\S]*?Decision ${decisionId}:[\\s\\S]*?<\\/div>`,
                            'g'
                          ),
                          ''
                        )
                        .trim();
            
                      // append new
                      const entry = makeNoteEntryHtml(
                        decisionId,
                        kd.scenario,
                        kd.options[idx].text,
                        kd.feedback
                      );
                      current.notes = current.notes
                        ? `${current.notes}<hr/>${entry}`
                        : entry;
            
                      await persist(progressData);
                    }}
                    onReSubmit={async (decisionId) => {
                      // 1️⃣ Split into blocks by your <hr/> divider
                      const parts = current.notes.split(/<hr\/?>/);
            
                      // 2️⃣ Filter out the one whose text includes “Decision X:”
                      const filtered = parts
                        .map((p) => p.trim())
                        .filter((p) => p && !p.includes(`Decision ${decisionId}:`));
            
                      // 3️⃣ Re-join, re-inserting <hr/> between each block
                      current.notes = filtered
                        .map((blockHtml, i) => (i > 0 ? `<hr/>${blockHtml}` : blockHtml))
                        .join('');
            
                      // 4️⃣ Reset the decision state
                      const kd = current.keyDecisions.find(
                        (d) => d.decisionId === decisionId
                      )!;
                      kd.status = 'Not Started';
                      delete kd.selectedOptionIndex;
                      delete kd.feedback;
            
                      // 5️⃣ Persist it
                      await persist(progressData);
                    }}
          />
        </Card>

        {/* Right: Quiz + Case Studies */}
        <Spacings.Stack scale="m">
          <Card insetScale="m">
            <Text.Headline as="h2">Quiz</Text.Headline>
            <ResourceCard
              icon={<ReviewIcon size="30" />}
              header={session.title + ' Quiz'}
              link={session.quiz}
              status={current.quizStatus}
              onDone={async () => {
                        current.quizStatus = 'Completed';
                        await persist(progressData);
                      }}
            />
          </Card>
          <Card insetScale="m">
          <Text.Headline as="h2">Case Exercises</Text.Headline>
            {current.case_studies.map((cs, idx) => {
              const orig = session.case_studies.find((c) => c.title === cs.title);
              return (
                <ResourceCard
                      icon={<ReviewIcon size="30" color="primary" />}
                      header={session.case_studies[0].title}
                      link={session.quiz}
                      status={current.quizStatus}
                      onDone={async () => {
                        current.quizStatus = 'Completed';
                        await persist(progressData);
                      }}
                    />
              );
            })}
          </Card>
        </Spacings.Stack>
      </Grid>

      {/* 4️⃣ Notes editor */}
      <Spacings.Stack scale="l">
        {/* <Text.Headline as="h1">Your Notes</Text.Headline> */}
        <RichNotesEditor
          value={localNotes}
          onChange={(html) => setLocalNotes(html)}
        />
        <Spacings.Stack scale="l">
        <Spacings.Inline scale="xs">
          <SecondaryButton
            label="Save Notes"
            onClick={async () => {
              const clean = DOMPurify.sanitize(localNotes, {
                USE_PROFILES: { html: true },
              });
              current.notes = clean;
              await persist(progressData);
            }}
          />
        </Spacings.Inline>

        </Spacings.Stack>
        
      </Spacings.Stack>

      {/* some global CSS tweaks */}
      <Global
        styles={css`
          .note-entry {
            margin-bottom: ${designTokens.spacingL};
            padding: ${designTokens.spacingM};
            border: 1px solid ${designTokens.colorNeutral60};
            border-radius: ${designTokens.borderRadius1};
          }
          hr {
            border: none;
            border-top: 1px solid ${designTokens.colorNeutral60};
            margin: ${designTokens.spacingL} 0;
          }
        `}
      />

    </Spacings.Stack>
  );
};

export default SessionPage;
