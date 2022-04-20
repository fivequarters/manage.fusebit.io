import { Feed } from '@interfaces/feed';
import { InnerConnector, Integration } from '@interfaces/integration';

export const getFeedByIntegration = (feed?: Feed[], integration?: Integration) =>
  (feed || []).find((i) => i.id === (integration || {})?.tags?.['fusebit.feedId']);

export const getConnectorFeedByComponent = (connectorsFeed?: Feed[], component?: InnerConnector) =>
  (connectorsFeed || []).find((item) => {
    return item?.configuration?.components?.some((feedComponent) => feedComponent.provider === component?.provider);
  });
