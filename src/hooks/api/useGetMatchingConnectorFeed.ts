import { useQuery } from 'react-query';
import { Connector } from '@interfaces/connector';
import { FinalConnector } from '@interfaces/integrationDetailDevelop';
import { connectorsFeed as getConnectorsFeed } from '../../static/feed';

export const findMatchingConnectorFeed = async (connector: Connector | FinalConnector) => {
  const handler = connector.data?.handler;
  const connectorsFeed = await getConnectorsFeed();

  return connectorsFeed.find((item) =>
    Object.keys(item.configuration.entities).find(
      (entity) => item.configuration.entities[entity].data.handler === handler
    )
  );
};

interface Props {
  connector: Connector | FinalConnector;
}

export const useGetMatchingConnectorFeed = ({ connector }: Props) => {
  return useQuery(['getMatchingConnectorFeed', { id: connector.id }], () => findMatchingConnectorFeed(connector), {
    enabled: !connector.missing,
  });
};
