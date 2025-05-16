import type { ReactNode } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Spacings from '@commercetools-uikit/spacings';
import SessionPage from './components/session-page/SessionPage';
import TrainerDashboard from './components/trainer-dashboard/TrainerDashboard';

type ApplicationRoutesProps = {
  children?: ReactNode;
};
const ApplicationRoutes = (_props: ApplicationRoutesProps) => {
  const match = useRouteMatch();

  /**
   * When using routes, there is a good chance that you might want to
   * restrict the access to a certain route based on the user permissions.
   * You can evaluate user permissions using the `useIsAuthorized` hook.
   * For more information see https://docs.commercetools.com/merchant-center-customizations/development/permissions
   *
   * NOTE that by default the Custom Application implicitly checks for a "View" permission,
   * otherwise it won't render. Therefore, checking for "View" permissions here
   * is redundant and not strictly necessary.
   */

  return (
    <Spacings.Inset scale="l">
      <Switch>
        <Route path={`${match.path}/trainer-dashboard`}>
          <TrainerDashboard />
        </Route>

        <Route path={`${match.path}/session1`}>
          <SessionPage sessionId={1} />
        </Route>
        <Route path={`${match.path}/session2`}>
          <SessionPage sessionId={2} />
        </Route>
        
        <Route path={`${match.path}/session3`}>
          <SessionPage sessionId={3} />
        </Route>

        <Route path={`${match.path}/session4`}>
          <SessionPage sessionId={4} />
        </Route>

        <Route path={`${match.path}/session5`}>
          <SessionPage sessionId={5} />
        </Route>

        <Route path={`${match.path}/session6`}>
          <SessionPage sessionId={6} />
        </Route>

        <Route path={`${match.path}/session7`}>
          <SessionPage sessionId={7} />
        </Route>

        <Route path={`${match.path}/session8`}>
          <SessionPage sessionId={8} />
        </Route>

        <Route path={`${match.path}/session9`}>
          <SessionPage sessionId={9} />
        </Route> 
        
      </Switch>
    </Spacings.Inset>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
