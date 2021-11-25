import { useQuery } from 'react-query';
import { Connector } from '@interfaces/connector';
import { Feed } from '@interfaces/feed';
import { FinalConnector } from '@interfaces/integrationDetailDevelop';
import { connectorsFeed, integrationsFeed } from '../../static/feed';

export const findMatchingConnectorFeed = async (connector: Connector | FinalConnector) => {
  return new Promise<Feed>((accept, reject) => {
    if (connector.tags && connector.data?.handler) {
      const feedId = connector.tags['fusebit.feedId'];
      const handler = connector.data?.handler;
      connectorsFeed().then((feed) => {
        feed.forEach((item) => {
          const entities = Object.keys(item.configuration.entities);
          entities.forEach((entity) => {
            if (item.configuration.entities[entity].data.handler === handler) {
              return accept(item);
            }
          });
        });
      });

      integrationsFeed().then((feed) => {
        feed.forEach((item) => {
          if (item.id === feedId) {
            return accept(item);
          }
        });
      });
    } else {
      return reject({});
    }
  });
};

interface Props {
  connector: Connector | FinalConnector;
}

export const useGetMatchingConnectorFeed = ({ connector }: Props) => {
  return useQuery(['getMatchingConnectorFeed', { id: connector.id }], () => findMatchingConnectorFeed(connector), {
    enabled: !connector.missing,
  });
};
