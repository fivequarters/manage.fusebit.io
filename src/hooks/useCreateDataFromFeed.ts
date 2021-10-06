import React from 'react';
import { useHistory } from 'react-router-dom';
import { useContext } from './useContext';
import { useReplaceMustache } from './useReplaceMustache';
import { useGetRedirectLink } from './useGetRedirectLink';
import { Entity, Feed } from '../interfaces/feed';
import { Data } from '../interfaces/feedPicker';
import { useLoader } from './useLoader';
import { useError } from './useError';
import { useEntityApi } from './useEntityApi';
import { trackEvent } from '../utils/analytics';

export const useCreateDataFromFeed = () => {
  const history = useHistory();
  const { userData } = useContext();
  const { getRedirectLink } = useGetRedirectLink();
  const { replaceMustache } = useReplaceMustache();
  const { createLoader, removeLoader } = useLoader();
  const { createEntity } = useEntityApi();
  const { createError } = useError();

  const createDataFromFeed = React.useCallback(
    async (activeFeed: Feed, data: Data, isConnector?: boolean) => {
      try {
        createLoader();

        const parsedFeed = await replaceMustache(data, activeFeed);
        const firstIntegration = parsedFeed.configuration.entities.find(
          (entity: Entity) => entity.entityType === 'integration'
        );
        const firstConnector = parsedFeed.configuration.entities.find(
          (entity: Entity) => entity.entityType === 'connector'
        );

        const commonTags = {
          'fusebit.feedType': isConnector ? 'connector' : 'integration',
          'fusebit.feedId': activeFeed.id,
        };

        if (isConnector) {
          trackEvent('New Connector Create Button Clicked', 'Connectors', { connector: commonTags['fusebit.feedId'] });
        } else {
          trackEvent('New Integration Create Button Clicked', 'Integrations', {
            integration: commonTags['fusebit.feedId'],
          });
        }

        await Promise.all([
          ...parsedFeed.configuration.entities.map(async (entity: Entity) => {
            await createEntity(entity, commonTags);
          }),
        ]);
        removeLoader();
        history.push(
          isConnector
            ? getRedirectLink(`/connector/${firstConnector?.id}/configure`)
            : getRedirectLink(`/integration/${firstIntegration?.id}/develop`)
        );
      } catch (e) {
        createError(e);
        removeLoader();
        return false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [createError, createLoader, userData, replaceMustache, getRedirectLink, removeLoader]
  );

  return {
    createDataFromFeed,
  };
};
