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

  // // 1️⃣ Load or init the Custom Object
  // useEffect(() => {
  //   const loadProgress = async () => {
  //     if (!projectKey) return;

  //     // A) identity
  //     const storedName = localStorage.getItem('fa-name');
  //     const storedEmail = localStorage.getItem('fa-email');
  //     if (!storedName || !storedEmail) {
  //       setShowModal(true);
  //       return;
  //     }
  //     setParticipant({ name: storedName, email: storedEmail });

  //     const args = {
  //       projectKey,
  //       container: 'participants-progress',
  //       key: storedEmail,
  //     };

  //     // B) fetch or init
  //     let data: ParticipantProgress;
  //     try {
  //       const obj = await fetchCustomObject(args);
  //       data = obj!.value!;
  //     } catch (err: any) {
  //       const status = err.response?.status || err.statusCode;
  //       if (status === 404) {
  //         // brand new participant → seed all sessions
  //         data = buildInitialProgress();
  //         await upsertCustomObject({ ...args, value: data });
  //       } else {
  //         console.error('Error loading progress:', err);
  //         return;
  //       }
  //     }

  //     setProgressData(data);
  //   };

  //   loadProgress();
  // }, [projectKey]);

  useEffect(() => {
    const loadProgress = async () => {

     


      if (!projectKey) return;
  
      // 1) Ensure we have a participant identity
      const storedEmail = localStorage.getItem('fa-email')!;
      const safeKey = makeSafeKey(storedEmail);
      const storedName = localStorage.getItem('fa-name');
      setParticipant({ name: storedName, email: storedEmail, key: safeKey });
     
      // const storedEmail = localStorage.getItem('fa-email');
      if (!storedName || !storedEmail) {
        setShowModal(true);
        return;
      }
      setParticipant({ name: storedName, email: storedEmail, key:safeKey });
  
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
      <SessionHeader session={session} participant={participant} />

      {/* overall progress */}
      <GlobalProgressBar
        masterSessions={allSessions}
        participantProgress={progressData}
      />

      {/* this session’s bar */}
      <ProgressBarComponent
        totalDecisions={session.keyDecisions.length}
        completedDecisions={current.keyDecisions.filter(
          (kd) => kd.status === 'Completed'
        ).length}
        quizStatus={current.quizStatus}
        caseStudiesCount={session.case_studies.length}
        completedCaseStudies={current.case_studies.filter(
          (cs) => cs.status === 'Completed'
        ).length}
      />

      <Spacings.Stack scale="l">
        <SessionOverview overview={session.overview} />

        <KeyDecisions
          items={current.keyDecisions}
          onSubmit={async (decisionId, idx) => {
            // update nested fields
            const kd = current.keyDecisions.find(
              (d) => d.decisionId === decisionId
            )!;
            kd.status = 'Completed';
            kd.selectedOptionIndex = idx;
            kd.feedback = kd.options[idx].feedback;

            await upsertCustomObject({
              projectKey,
              container: 'participants-progress',
              key: participant!.email,
              value: progressData!,
            });
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
        />

        <QuizSection
          link={session.quiz}
          status={current.quizStatus}
          onDone={async () => {
            current.quizStatus = 'Completed';
            await upsertCustomObject({
              projectKey,
              container: 'participants-progress',
              key: participant!.email,
              value: progressData!,
            });
            setProgressData({ ...progressData! });
          }}
        />

        <CaseStudies
          items={current.case_studies}
          onUpdate={async (idx) => {
            current.case_studies[idx].status = 'Completed';
            await upsertCustomObject({
              projectKey,
              container: 'participants-progress',
              key: participant!.email,
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
              key: participant!.email,
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
