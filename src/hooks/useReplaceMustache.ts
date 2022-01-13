import React from 'react';
import Mustache from 'mustache';
import { Data } from '@interfaces/feedPicker';
import { Feed, ParsedFeed } from '@interfaces/feed';
import { useAuthContext } from './useAuthContext';

const walkObjectStrings = (obj: any, func: (value: string) => string): any => {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string') {
      obj[key] = func(value);
    } else if (typeof value === 'object') {
      walkObjectStrings(value, func);
    }
  });
  return obj;
};

const checkIfEntitiesAreValid = (parsedFeed: Feed) => {
  if (Array.isArray(parsedFeed.configuration.entities)) {
    const err = {
      statusCode: 403,
      message: 'Entities cant be an array',
    };
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw err;
  }
};

export const useReplaceMustache = () => {
  const { userData } = useAuthContext();

  const replaceMustache = React.useCallback(
    async (data: Data, feedMaster: Feed): Promise<ParsedFeed> => {
      // This hurts but it's easy.
      const oldMustacheEscape = Mustache.escape;
      try {
        checkIfEntitiesAreValid(feedMaster);
        const feed = JSON.parse(JSON.stringify(feedMaster)) as Feed;
        const parsedFeed = (feed as unknown) as ParsedFeed; // Feed, but with a different configuration.entities
        const customTags: any = ['<%', '%>'];

        // Disable html escaping because these values are all trusted
        Mustache.escape = (s: string) => s;

        const global: any = {
          entities: {},
          consts: {
            userId: userData.userId,
            accountId: userData.accountId,
            subscriptionId: userData.subscriptionId,
            endpoint: process.env.REACT_APP_FUSEBIT_DEPLOYMENT,
            integrationId: () => {
              const integration: any = Object.entries(feed.configuration.entities).find(
                ([, entity]) => entity.entityType === 'integration'
              );
              return integration ? global.entities[integration[0]]?.id() || integration[1].id : '';
            },
            random: () => {
              const randBuffer = [...window.crypto.getRandomValues(new Uint8Array(32))];
              return randBuffer.map((x) => x.toString(16).padStart(2, '0')).join('');
            },
            feed: { ...JSON.parse(JSON.stringify(feed)) },
          },
          query: {},
        };

        const urlSearchParams = new URLSearchParams(window.location.search);
        const fusebitParams = urlSearchParams.get('fusebitParams');
        if (fusebitParams) {
          try {
            global.query = JSON.parse(fusebitParams);
          } catch (e) {
            // empty
          }
        }

        // No really good reason to delete this besides it making it difficult to console.log the globals.
        delete global.consts.feed.configuration;

        if (feed.configuration?.entities) {
          // Populate the global entities first, so that the id is always available and always consistent
          Object.entries(feed.configuration.entities).forEach(([name, entity]) => {
            if (!data[name]) {
              data[name] = {};
            }
            global.entities[name] = {
              ...data[name],
              id: () => {
                if (!data[name].id) {
                  data[name].id = `${
                    entity.entityType === 'integration' ? 'my-integration' : 'my-connector'
                  }-${Math.floor(Math.random() * 1000)}`;
                }
                return data[name].id;
              },
            };
          });

          // Now parse each entity, replacing it's strings as appropriate
          parsedFeed.configuration.entities = Object.entries(feed.configuration.entities).map(([name, entity]) => {
            const view = {
              this: {
                id: () => global.entities[name].id(),
                name,
              },
              global,
            };
            return walkObjectStrings(entity, (value: string) => Mustache.render(value, view, {}, customTags));
          });
        }
        feed.description = Mustache.render(feed.description, { global }, {}, customTags);

        return parsedFeed;
      } finally {
        Mustache.escape = oldMustacheEscape;
      }
    },
    [userData]
  );

  return {
    replaceMustache,
  };
};
