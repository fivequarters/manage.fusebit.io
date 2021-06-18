import Home from '../pages/Home';
import { RouteItem } from "../interfaces/router";
 
// define app routes
export const routes: Array<RouteItem> = [
    {
        key: "router-home",
        path: "/",
        component: Home
    }
]