import ConnectorsPage from '../pages/ConnectorsPage';
import IntegrationsPage from '../pages/IntegrationsPage';
import IntegrationDetailPage from "../pages/IntegrationDetailPage";
import { RouteItem } from "../interfaces/router";
 
// define app routes
export const routes: Array<RouteItem> = [
    {
        key: "router-home",
        path: "/",
        component: ConnectorsPage
    },
    {
        key: "router-integrations",
        path: "/integrations",
        component: IntegrationsPage,
    },
    {
        key: "router-integration-detail",
        path: "/integration-detail",
        component: IntegrationDetailPage,
    },
]