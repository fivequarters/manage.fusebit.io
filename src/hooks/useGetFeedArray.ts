import {integrationsFeed} from "../static/feed";
import {connectorsFeed} from "../static/feed";

export const  useGetFeedArray = () => {

    const getIntegrationsFeed = () => {
        return integrationsFeed;
    }

    const getConnectorsFeed = () => {
        return connectorsFeed;
    }

    return {
        getIntegrationsFeed,
        getConnectorsFeed
    };
};