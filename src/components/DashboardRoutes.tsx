import { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import { routes } from '../config';
import { RouteItem } from '../interfaces/router';
import ProtectedRoute from './ProtectedRoute';

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
                <ProtectedRoute>
                  <RouteComponent />
                </ProtectedRoute>
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
