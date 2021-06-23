import ConnectorsPage from '../pages/ConnectorsPage';
import IntegrationsPage from '../pages/IntegrationsPage';
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
]