import ConnectorsPage from '../pages/ConnectorsPage';
import IntegrationsPage from '../pages/IntegrationsPage';
import IntegrationDetailPage from "../pages/IntegrationDetailPage";
import ConnectorDetailPage from "../pages/ConnectorDetailPage";
import LoggedOutErrorPage from "../pages/LoggedOutErrorPage";
import FatalErrorPage from "../pages/FatalErrorPage";
import AuthCallback from "../pages/AuthCallback";
import NotFoundPage from "../pages/NotFoundPage";
import { RouteItem } from "../interfaces/router";

// define app routes
export const routes: Array<RouteItem> = [
    {
        key: "router-home",
        path: "/connectors",
        component: ConnectorsPage
    },
    {
        key: "router-integrations",
        path: "/",
        component: IntegrationsPage,
    },
    {
        key: "router-integration-detail",
        path: "/integration/:id",
        component: IntegrationDetailPage,
    },
    {
        key: "router-connector-detail",
        path: "/connector/:id",
        component: ConnectorDetailPage,
    },
    {
        key: "router-auth-callback",
        path: "/callback",
        component: AuthCallback,
    },
    {
        key: "logged-out-error",
        path: "/logged-out-error",
        component: LoggedOutErrorPage,
    },
    {
        key: "fatal-error",
        path: "/fatal-error",
        component: FatalErrorPage,
    },
    {
        key: "404",
        path: "*",
        component: NotFoundPage
    }
]