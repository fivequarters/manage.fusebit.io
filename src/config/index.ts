import ConnectorsPage from '../pages/ConnectorsPage';
import IntegrationsPage from '../pages/IntegrationsPage';
import IntegrationDetailPage from '../pages/IntegrationDetailPage';
import ConnectorDetailPage from '../pages/ConnectorDetailPage';
import LoggedOutErrorPage from '../pages/LoggedOutErrorPage';
import AuthenticationPage from '../pages/AuthenticationPage';
import AuthenticationDetailPage from '../pages/AuthenticationDetailPage';
import FatalErrorPage from '../pages/FatalErrorPage';
import AuthCallback from '../pages/AuthCallback';
import NotFoundPage from '../pages/NotFoundPage';
import { RouteItem } from '../interfaces/router';

// define app routes
export const routes: Array<RouteItem> = [
  {
    key: 'router-home',
    path: '/account/:accountId/subscription/:subscriptionId/connectors',
    component: ConnectorsPage,
  },
  {
    key: 'router-integrations',
    path: '/account/:accountId/subscription/:subscriptionId/integrations',
    component: IntegrationsPage,
  },
  {
    key: 'router-integration-detail',
    path: '/account/:accountId/subscription/:subscriptionId/integration/:id',
    component: IntegrationDetailPage,
  },
  {
    key: 'router-connector-detail',
    path: '/account/:accountId/subscription/:subscriptionId/connector/:id',
    component: ConnectorDetailPage,
  },
  {
    key: 'router-auth-callback',
    path: '/callback',
    component: AuthCallback,
  },
  {
    key: 'router-logged-out',
    path: '/logged-out',
    component: LoggedOutErrorPage,
  },
  {
    key: 'router-authentication',
    path: '/account/:accountId/subscription/:subscriptionId/authentication',
    component: AuthenticationPage,
  },
  {
    key: 'router-authentication-detail',
    path: '/account/:accountId/subscription/:subscriptionId/authentication/detail',
    component: AuthenticationDetailPage,
  },
  {
    key: 'router-fatal-error',
    path: '/fatal-error',
    component: FatalErrorPage,
  },
  {
    key: '404',
    path: '*',
    component: NotFoundPage,
  },
];
