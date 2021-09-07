import { useContext } from './useContext';
import React from 'react';
import { useReplaceMustache } from './useReplaceMustache';
import { useGetRedirectLink } from './useGetRedirectLink';
import { Entity, Feed } from '../interfaces/feed';
import { Data } from '../interfaces/feedPicker';
import { useLoader } from './useLoader';
import { useError } from './useError';
import { useHistory } from 'react-router-dom';
import { useEntityApi } from './useEntityApi';

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
        let firstIntegration: Entity | undefined;
        let firstConnector: Entity | undefined;

        const parsedFeed = await replaceMustache(data, activeFeed);
        firstIntegration = parsedFeed.configuration.entities.find(
          (entity: Entity) => entity.entityType === 'integration'
        );
        firstConnector = parsedFeed.configuration.entities.find((entity: Entity) => entity.entityType === 'connector');

        const commonTags = {
          'fusebit.feedType': isConnector ? 'connector' : 'integration',
          'fusebit.feedId': activeFeed.id,
        };

        await Promise.all([
          ...parsedFeed.configuration.entities.map(async (entity: Entity) => {
            await createEntity(entity, commonTags);
          }),
        ]);
        removeLoader();
        history.push(
          isConnector
            ? getRedirectLink('/connector/' + firstConnector?.id + '/configure')
            : getRedirectLink('/integration/' + firstIntegration?.id + '/develop')
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
