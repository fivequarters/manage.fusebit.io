import { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import { RouteItem } from '@interfaces/router';
import { ErrorBoundary } from 'react-error-boundary';
import { routes } from '../config';
import ProtectedRoute from './ProtectedRoute';
import FatalError from './common/FatalError';

const DashboardRoutes: FC<{}> = () => {
  return (
    <Switch>
      {routes.map((route: RouteItem) => (
        <Route
          key={`${route.key}`}
          path={`${route.path}`}
          render={() => {
            const RouteComponent = route.component;
            if (!route.public) {
              return (
                // Error Boundary should be the first element in the route
                // and not above the Switch to make the routing in the fatal error screen
                // work properly
                <ErrorBoundary FallbackComponent={FatalError}>
                  <ProtectedRoute>
                    <RouteComponent />
                  </ProtectedRoute>
                </ErrorBoundary>
              );
            }
            return <RouteComponent />;
          }}
          exact
        />
      ))}
    </Switch>
  );
};

export default DashboardRoutes;
