import { useQuery } from 'react-query';
import { Connector } from '@interfaces/connector';
import { FinalConnector } from '@interfaces/integrationDetailDevelop';
import { connectorsFeed as getConnectorsFeed, integrationsFeed as getIntegrationsFeed } from '../../static/feed';

export const findMatchingConnectorFeed = async (connector: Connector | FinalConnector) => {
  let connectorData;
  const handler = connector.data?.handler;
  const connectorsFeed = await getConnectorsFeed();

  connectorData = connectorsFeed.find((item) => {
    const entities = Object.keys(item.configuration.entities);

    return entities.find((entity) => item.configuration.entities[entity].data.handler === handler);
  });

  if (!connectorData) {
    const feedId = connector?.tags?.['fusebit.feedId'];

    const integrationsFeed = await getIntegrationsFeed();

    connectorData = integrationsFeed.find((item) => item.id === feedId);
  }

  return connectorData;
};

interface Props {
  connector: Connector | FinalConnector;
}

export const useGetMatchingConnectorFeed = ({ connector }: Props) => {
  return useQuery(['getMatchingConnectorFeed', { id: connector.id }], () => findMatchingConnectorFeed(connector), {
    enabled: !connector.missing,
  });
};
