import { Spacings } from '@commercetools-frontend/ui-kit';
import React from 'react';

interface SessionOverviewProps { overview: string; }
export const SessionOverview: React.FC<SessionOverviewProps> = ({ overview }) => (

  <Spacings.Inset scale="l">
  <div>
    {/* <h3>Overview</h3> */}
    <p>{overview}</p>
  </div>
  </Spacings.Inset>
);