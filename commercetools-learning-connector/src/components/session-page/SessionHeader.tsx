// src/components/session-page/SessionHeader.tsx
import React from 'react';
import Spacings from '@commercetools-uikit/spacings';

interface SessionHeaderProps {
  session: {
    title: string;
    id: number
  };
  participant: {
    name: string | null
    email: string | null,
    key: string | null
  };
}

export const SessionHeader: React.FC<SessionHeaderProps> = ({ session, participant }) => (
  <Spacings.Inset scale="l">
    
    {/* <div>👋 Hello, {participant.name}!</div> */}

    <h2>Session {session.id} - {session.title}</h2>

  </Spacings.Inset>
);
