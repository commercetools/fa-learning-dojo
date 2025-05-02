// src/components/session-page/SessionPage.tsx
import React, { useEffect, useState } from 'react';
import { FormDialog } from '@commercetools-frontend/application-components';
import { TextField, Spacings } from '@commercetools-frontend/ui-kit';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

import { fetchCustomObject, upsertCustomObject } from '../../api/customObjects';
import sessionsJson from '../../data/sessions.json';

import { GlobalProgressBar } from '../global-progress-bar/GlobalProgressBar';
import { ProgressBarComponent } from '../progress-bar/ProgressBar';
import { SessionOverview } from './SessionOverview';
import { KeyDecisions } from '../key-decisions/KeyDecisions';
import { QuizSection } from '../quiz-section/QuizSection';
import { CaseStudies } from '../case-studies/CaseStudies';
import { NotesEditor } from '../notes-editor/NotesEditor';
import { SessionHeader } from './SessionHeader';
import { KeyDecisionsCollapsible } from '../key-decisions/KeyDecisionsCollapsible';
import QuickStartGuideHeader from '../key-decisions/QuickStartGuideHeader';
import IconCard from '../icon-card/icon-card';

function makeSafeKey(email: string): string {
  return email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
}


// --- Types ---
export interface Session {
  id: number;
  title: string;
  overview: string;
  keyDecisions: Array<{
    decisionId: number;
    title: string;
    scenario: string;
    options: Array<{ text: string; isCorrect: boolean; feedback: string }>;
  }>;
  quiz: string;
  case_studies: Array<{ title: string; link: string }>;
}

export interface SessionProgress extends Omit<Session, 'keyDecisions' | 'case_studies'> {
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
    Session['case_studies'][0] & {
      status: 'Not Started' | 'Completed';
    }
  >;
}

export interface ParticipantProgress {
  participantProgressData: SessionProgress[];
}

export interface SessionPageProps {
  sessionId: number;
}

// --- Component ---

const SessionPage: React.FC<SessionPageProps> = ({ sessionId }) => {
  const projectKey = useApplicationContext((ctx) => ctx.project!.key)!;
  const allSessions: Session[] = sessionsJson.sessions;
  const session = allSessions.find((s) => s.id === sessionId)!;

  const [participant, setParticipant] =
    useState<{ name: string | null ; email: string, key: string } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const [progressData, setProgressData] = useState<ParticipantProgress | null>(
    null
  );

  // Utility to make a fresh SessionProgress for *all* sessions:
  const buildInitialProgress = (): ParticipantProgress => ({
    participantProgressData: allSessions.map((s) => ({
      ...s,
      quizStatus: 'Not Started' as const,
      notes: '',
      keyDecisions: s.keyDecisions.map((kd) => ({
        ...kd,
        status: 'Not Started' as const,
      })),
      case_studies: s.case_studies.map((cs) => ({
        ...cs,
        status: 'Not Started' as const,
      })),
    })),
  });

  useEffect(() => {
    const loadProgress = async () => {

     if (!projectKey) return;
  
      // 1) Ensure we have a participant identity
      const storedEmail = localStorage.getItem('fa-email')!;
      
      const storedName = localStorage.getItem('fa-name');


      if (!storedEmail || !storedName) {
         setShowModal(true);
                return;
        }
     
      const safeKey = makeSafeKey(storedEmail);
      setParticipant({ name: storedName, email: storedEmail, key: safeKey });
  
      const args = {
        projectKey,
        container: 'participants-progress',
        key: safeKey,
      };
  
      let fetchedObj: { value?: ParticipantProgress } | null = null;
      try {
        // 2) Try fetching the existing Custom Object
        fetchedObj = await fetchCustomObject(args);
      } catch (err: any) {
        const status = err.response?.status || err.statusCode;
        // 3) Only on 404 do we seed new data
        if (status === 404) {
          const initial = buildInitialProgress();
          await upsertCustomObject({ ...args, value: initial });
          setProgressData(initial);
          return;
        } else {
          console.error('Error loading progress:', err);
          return;
        }
      }
  
      // 4) If fetch succeeded but we got no .value, treat as missing
      if (!fetchedObj || fetchedObj.value == null) {
        const initial = buildInitialProgress();
        await upsertCustomObject({ ...args, value: initial });
        setProgressData(initial);
        return;
      }
  
      // 5) 🎉 We have a real value—use it!
      setProgressData(fetchedObj.value);
    };
  
    loadProgress();
  }, [projectKey]);
  
  
  

  // 2️⃣ Handle first-time registration
  const handleModalSubmit = async () => {
    if (!projectKey) return;
    setShowModal(false);
    localStorage.setItem('fa-name', nameInput);
    localStorage.setItem('fa-email', emailInput);
    setParticipant({ name: nameInput, email: emailInput, key: '' });

    const initial = buildInitialProgress();
    try {
      await upsertCustomObject({
        projectKey,
        container: 'participants-progress',
        key: participant!.key,
        value: initial,
      });
      setProgressData(initial);
    } catch (err) {
      console.error('Error creating participant object:', err);
    }
  };

  // 3️⃣ Show the name/email dialog once
  if (showModal) {
    return (
      <FormDialog
        isOpen={showModal}
        title="👋 Welcome! Enter your details"
        labelPrimary="Submit"
        onPrimaryButtonClick={handleModalSubmit}
        labelSecondary="Cancel"
        onSecondaryButtonClick={() => setShowModal(false)}
      >
        <Spacings.Stack scale="m">
          <TextField
            name="firstName"
            title="First Name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <TextField
            name="email"
            title="Email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
        </Spacings.Stack>
      </FormDialog>
    );
  }

  // 4️⃣ Still loading?
  if (!participant || !progressData) {
    return <div>Loading your session…</div>;
  }

  // 5️⃣ Grab the record for this session
  const current = progressData.participantProgressData.find(
    (p) => p.id === sessionId
  )!;

  // 6️⃣ Render everything
  return (
    <div>

    <GlobalProgressBar
            masterSessions={allSessions}
            participantProgress={progressData}
            participant={participant}
          />

      <SessionHeader session={session} participant={participant} />
      <SessionOverview overview={session.overview} />
      {/* overall progress */}
      

      {/* this session’s bar */}
      {/* <ProgressBarComponent
        totalDecisions={session.keyDecisions.length}
        completedDecisions={current.keyDecisions.filter(
          (kd) => kd.status === 'Completed'
        ).length}
        quizStatus={current.quizStatus}
        caseStudiesCount={session.case_studies.length}
        completedCaseStudies={current.case_studies.filter(
          (cs) => cs.status === 'Completed'
        ).length}
      /> */}

      <Spacings.Stack scale="l">
       


        {/* <KeyDecisions
          items={current.keyDecisions}
          onSubmit={async (decisionId, idx) => {
            // 1) Update the key‐decision status, selection & feedback:
            const kd = current.keyDecisions.find((d) => d.decisionId === decisionId)!;
            kd.status = 'Completed';
            kd.selectedOptionIndex = idx;
            kd.feedback = kd.options[idx].feedback;

            // 2) Append to this session’s notes:
            const noteEntry = [
              `📝 Decision ${decisionId}: ${kd.scenario}`,
              `• Selected: ${kd.options[idx].text}`,
              `• Feedback: ${kd.feedback}`,
            ].join('\n') + '\n';

            // Merge with any existing notes
            current.notes = (current.notes || '') + noteEntry;

            // 3) Persist the updated progressData (with new notes)
            await upsertCustomObject({
              projectKey,
              container: 'participants-progress',
              key: participant!.key,
              value: progressData!,
            });

            // 4) Refresh local state
            setProgressData({ ...progressData! });
          }}
          onReSubmit={(decisionId) => {
            const kd = current.keyDecisions.find(
              (d) => d.decisionId === decisionId
            )!;
            kd.status = 'Not Started';
            delete kd.selectedOptionIndex;
            delete kd.feedback;
            setProgressData({ ...progressData! });
          }}
        /> */}

      <KeyDecisionsCollapsible
        items={current.keyDecisions}
        onSubmit={async (decisionId, idx) => {
          // 1) Update your state
          const kd = current.keyDecisions.find((d) => d.decisionId === decisionId)!;
          kd.status = 'Completed';
          kd.selectedOptionIndex = idx;
          kd.feedback = kd.options[idx].feedback;

          // 2) Append to notes as before (optional)
          const noteEntry = [
            `📝 Decision ${decisionId}: ${kd.scenario}`,
            `• Selected: ${kd.options[idx].text}`,
            `• Feedback: ${kd.feedback}`,
          ].join('\n') + '\n\n';
          current.notes = (current.notes || '') + noteEntry;

          // 3) Persist
          await upsertCustomObject({
            projectKey,
            container: 'participants-progress',
            key: participant.key,
            value: progressData,
          });
          // 4) Rerender
          setProgressData({ ...progressData });
        }}
        onReSubmit={(decisionId) => {
          const kd = current.keyDecisions.find((d) => d.decisionId === decisionId)!;
          kd.status = 'Not Started';
          delete kd.selectedOptionIndex;
          delete kd.feedback;
          setProgressData({ ...progressData });
        }}
      />

<QuickStartGuideHeader
              content="Session Quiz"
              />

         
        <QuizSection
          link={session.quiz}
          status={current.quizStatus}
          onDone={async () => {
            current.quizStatus = 'Completed';
            await upsertCustomObject({
              projectKey,
              container: 'participants-progress',
              key: participant!.key,
              value: progressData!,
            });
            setProgressData({ ...progressData! });
          }}
        />

      <QuickStartGuideHeader
              content="Case Exercises"
              />

        <CaseStudies
          items={current.case_studies}
          onUpdate={async (idx) => {
            current.case_studies[idx].status = 'Completed';
            await upsertCustomObject({
              projectKey,
              container: 'participants-progress',
              key: participant!.key,
              value: progressData!,
            });
            setProgressData({ ...progressData! });
          }}
        />

        <NotesEditor
          notes={current.notes}
          onSave={async (newNotes) => {
            current.notes = newNotes;
            await upsertCustomObject({
              projectKey,
              container: 'participants-progress',
              key: participant!.key,
              value: progressData!,
            });
            setProgressData({ ...progressData! });
          }}
        />
      </Spacings.Stack>
    </div>
  );
};

export default SessionPage;


