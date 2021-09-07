import React from 'react';
import { useContext } from './useContext';
import Mustache from 'mustache';
import { Data } from '../interfaces/feedPicker';
import { Feed, Entity } from '../interfaces/feed';

const walkObjectStrings = (obj: any, func: (value: string) => string): any => {
  Object.entries(obj).forEach(([key, value]: [string, any]) => {
    if (typeof value == 'string') {
      obj[key] = func(value);
    } else if (typeof value == 'object') {
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
    throw err;
  }
};

export const useReplaceMustache = () => {
  const { userData } = useContext();

  const replaceMustache = React.useCallback(
    async (data: Data, feedMaster: Feed) => {
      // This hurts but it's easy.
      const oldMustacheEscape = Mustache.escape;
      try {
        checkIfEntitiesAreValid(feedMaster);
        const feed = JSON.parse(JSON.stringify(feedMaster));
        const customTags: any = ['<%', '%>'];

        // Disable html escaping because these values are all trusted
        Mustache.escape = (s: string) => s;

        let global: any = {
          entities: {},
          consts: {
            userId: userData.userId,
            accountId: userData.accountId,
            subscriptionId: userData.subscriptionId,
            endpoint: process.env.REACT_APP_FUSEBIT_DEPLOYMENT,
            integrationId: () => {
              const integration: any = Object.entries(feed.configuration.entities as Record<string, Entity>).find(
                ([name, entity]: [string, Entity]) => entity.entityType === 'integration'
              );
              return integration ? global.entities[integration[0]]?.id() || integration[1].id : '';
            },
            random: () => {
              const randBuffer = [...window.crypto.getRandomValues(new Uint8Array(32))];
              return randBuffer.map((x) => x.toString(16).padStart(2, '0')).join('');
            },
            feed: { ...JSON.parse(JSON.stringify(feed)) },
          },
        };

        // No really good reason to delete this besides it making it difficult to console.log the globals.
        delete global.consts.feed.configuration;

        const newEntities: Entity[] = [];

        // Populate the global entities first, so that the id is always available and always consistent
        Object.entries(feed.configuration.entities as Record<string, Entity>).forEach(
          ([name, entity]: [string, Entity]) => {
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
          }
        );

        // Now parse each entity, replacing it's strings as appropriate
        Object.entries(feed.configuration.entities as Record<string, Entity>).forEach(
          ([name, entity]: [string, Entity]) => {
            const view = {
              this: {
                id: () => global.entities[name].id(),
                name,
              },
              global,
            };
            newEntities.push(
              walkObjectStrings(entity, (value: string) => Mustache.render(value, view, {}, customTags))
            );
          }
        );

        feed.configuration.entities = newEntities;

        feed.description = Mustache.render(feed.description, { global }, {}, customTags);

        return feed;
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
