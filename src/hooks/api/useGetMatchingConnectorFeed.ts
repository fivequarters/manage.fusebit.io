import { useQuery } from 'react-query';
import { Connector } from '@interfaces/connector';
import { Feed } from '@interfaces/feed';
import { FinalConnector } from '@interfaces/integrationDetailDevelop';
import { connectorsFeed, integrationsFeed } from '../../static/feed';

export const findMatchingConnectorFeed = async (connector: Connector | FinalConnector) => {
  return new Promise<Feed>((accept, reject) => {
    if (connector.tags) {
      const service = connector.tags['fusebit.service'].replace(/\s+/g, '-').toLowerCase();
      const feedId = connector.tags['fusebit.feedId'];
      connectorsFeed().then((feed) => {
        feed.forEach((item) => {
          if (item.id.match(service)) {
            return accept(item);
          }
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
