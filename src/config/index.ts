import { RouteItem } from '@interfaces/router';
import ConnectorsOverviewPage from '../pages/ConnectorsOverviewPage';
import IntegrationsOverviewPage from '../pages/IntegrationsOverviewPage';
import IntegrationDetailDevelopPage from '../pages/IntegrationDetailDevelopPage';
import IntegrationDetailInstallsPage from '../pages/IntegrationDetailInstallsPage';
import ConnectorDetailConfigurePage from '../pages/ConnectorDetailConfigurePage';
import ConnectorDetailIdentitiesPage from '../pages/ConnectorDetailIdentitiesPage';
import LoggedOutErrorPage from '../pages/LoggedOutErrorPage';
import AuthenticationDetailOverviewPage from '../pages/AuthenticationDetailOverviewPage';
import FatalErrorPage from '../pages/FatalErrorPage';
import AuthCallbackPage from '../pages/AuthCallbackPage';
import NotFoundPage from '../pages/NotFoundPage';
import AccountSettingsPage from '../pages/AccountSettingsPage';
import AccountTeamPage from '../pages/AccountTeamPage';

// define app routes
export const routes: Array<RouteItem> = [
  {
    key: 'router-connectors-overview',
    path: '/account/:accountId/subscription/:subscriptionId/connectors/overview',
    component: ConnectorsOverviewPage,
  },
  {
    key: 'router-integrations-overview',
    path: '/account/:accountId/subscription/:subscriptionId/integrations/overview',
    component: IntegrationsOverviewPage,
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
    component: AuthCallbackPage,
    public: true,
  },
  {
    key: 'router-logged-out',
    path: '/logged-out',
    component: LoggedOutErrorPage,
    public: true,
  },
  {
    key: 'router-account',
    path: '/account/:accountId/settings',
    component: AccountSettingsPage,
  },
  {
    key: 'router-account',
    path: '/account/:accountId/team',
    component: AccountTeamPage,
  },
  {
    key: 'router-authentication-detail-overview',
    path: '/account/:accountId/subscription/:subscriptionId/authentication/:userId/overview',
    component: AuthenticationDetailOverviewPage,
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
