import { useContext } from './useContext';
import React from 'react';
import { useReplaceMustache } from './useReplaceMustache';
import { useGetRedirectLink } from './useGetRedirectLink';
import { Entity, Feed } from '../interfaces/feed';
import { Data } from '../interfaces/feedPicker';
import { useLoader } from './useLoader';
import { useError } from './useError';
import { Operation } from '../interfaces/operation';
import { useAccountConnectorCreateConnector } from './api/v2/account/connector/useCreateOne';
import { useAccountIntegrationCreateIntegration } from './api/v2/account/integration/useCreateOne';
import { useHistory } from 'react-router-dom';

export const useCreateDataFromFeed = () => {
  const history = useHistory();
  const { userData } = useContext();
  const { getRedirectLink } = useGetRedirectLink();
  const { replaceMustache } = useReplaceMustache();
  const { waitForOperations, createLoader, removeLoader } = useLoader();
  const { createError } = useError();
  const createConnector = useAccountConnectorCreateConnector<Operation>();
  const createIntegration = useAccountIntegrationCreateIntegration<Operation>();

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
            const obj = {
              data: entity.data,
              id: entity.id,
              tags: { ...commonTags, ...entity.tags },
              accountId: userData.accountId,
              subscriptionId: userData.subscriptionId,
            };
            const response =
              entity.entityType === 'connector'
                ? await createConnector.mutateAsync(obj)
                : await createIntegration.mutateAsync(obj);
            await waitForOperations([response.data.operationId]);
          }),
        ]);
        removeLoader();
        history.push(
          isConnector
            ? getRedirectLink('/connector/' + firstConnector?.id + '/configure')
            : getRedirectLink('/integration/' + firstIntegration?.id + '/develop')
        );
        // window.location.href = isConnector
        //   ? getRedirectLink('/connector/' + firstConnector?.id + '/configure')
        //   : getRedirectLink('/integration/' + firstIntegration?.id + '/develop');
      } catch (e) {
        createError(e.message);
        removeLoader();
        return false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      createConnector,
      createError,
      createIntegration,
      createLoader,
      userData,
      waitForOperations,
      replaceMustache,
      getRedirectLink,
      removeLoader,
    ]
  );

  return {
    createDataFromFeed,
  };
};
