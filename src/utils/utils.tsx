import { Entity, Feed } from '../interfaces/feed';
import { FinalConnector } from '../interfaces/integrationDetailDevelop';
import { integrationsFeed, connectorsFeed } from '../static/feed';

export const findMatchingConnectorFeed = async (connector: Entity | FinalConnector) => {
  return new Promise<Feed>((accept, reject) => {
    if (connector.tags) {
      const feedtype = connector.tags['fusebit.feedType'];
      const feedId = connector.tags['fusebit.feedId'];

      if (feedtype === 'integration') {
        integrationsFeed().then((feed) => {
          feed.forEach((item) => {
            if (item.id === feedId) {
              accept(item);
            }
          });
        });
      } else {
        connectorsFeed().then((feed) => {
          feed.forEach((item) => {
            if (item.id === feedId) {
              accept(item);
            }
          });
        });
      }
    } else {
      reject({});
    }
  });
};
