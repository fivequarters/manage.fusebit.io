import ConnectorsPage from '../pages/ConnectorsPage';
import IntegrationsPage from '../pages/IntegrationsPage';
import IntegrationDetailDevelopPage from '../pages/IntegrationDetailDevelopPage';
import IntegrationDetailInstallsPage from '../pages/IntegrationDetailInstallsPage';
import ConnectorDetailConfigurePage from '../pages/ConnectorDetailConfigurePage';
import ConnectorDetailIdentitiesPage from '../pages/ConnectorDetailIdentitiesPage';
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
    key: 'router-integration-detail-develop',
    path: '/account/:accountId/subscription/:subscriptionId/integration/:id/develop',
    component: IntegrationDetailDevelopPage,
  },
  {
    key: 'router-integration-detail-installs',
    path: '/account/:accountId/subscription/:subscriptionId/integration/:id/installs',
    component: IntegrationDetailInstallsPage,
  },
  {
    key: 'router-connector-detail-configure',
    path: '/account/:accountId/subscription/:subscriptionId/connector/:id/configure',
    component: ConnectorDetailConfigurePage,
  },
  {
    key: 'router-connector-detail-identities',
    path: '/account/:accountId/subscription/:subscriptionId/connector/:id/identities',
    component: ConnectorDetailIdentitiesPage,
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
    path: '/account/:accountId/subscription/:subscriptionId/authentication/:userId',
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
