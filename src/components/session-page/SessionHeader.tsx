// src/components/session-page/SessionHeader.tsx
import React from 'react';
import Spacings from '@commercetools-uikit/spacings';

interface SessionHeaderProps {
  session: {
    title: string;
  };
  participant: {
    name: string | null
    email: string | null,
    key: string | null
  };
}

export const SessionHeader: React.FC<SessionHeaderProps> = ({ session, participant }) => (
  <Spacings.Inset scale="l">
    <h2>{session.title}</h2>
    <div>👋 Hello, {participant.name}!</div>
  </Spacings.Inset>
);
