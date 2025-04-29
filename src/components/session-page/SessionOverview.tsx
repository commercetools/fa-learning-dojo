import React from 'react';

interface SessionOverviewProps { overview: string; }
export const SessionOverview: React.FC<SessionOverviewProps> = ({ overview }) => (
  <div>
    <h3>Overview</h3>
    <p>{overview}</p>
  </div>
);