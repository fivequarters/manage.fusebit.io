import { useQueryClient } from 'react-query';
import { Entity, Feed, ParsedFeed } from '@interfaces/feed';
import { Data } from '@interfaces/feedPicker';
import { trackEventMemoized } from '@utils/analytics';
import { Integration } from '@interfaces/integration';
import { ApiResponse } from './useAxios';
import { useError } from './useError';
import { useEntityApi } from './useEntityApi';
import { useReplaceMustache } from './useReplaceMustache';
import { ACCOUNT_INTEGRATIONS_GET_ONE } from './api/v2/account/integration/useGetOne';

const getCommonTags = (feed: Feed, entityType: 'integration' | 'connector') => {
  return {
    'fusebit.feedType': entityType,
    'fusebit.feedId': feed.id,
  };
};

export const useCreateDataFromFeed = () => {
  const { replaceMustache } = useReplaceMustache();
  const { createEntity, addConnectorToIntegration } = useEntityApi();
  const { createError } = useError();
  const queryClient = useQueryClient();

  const createFromFeed = async (
    parsedFeed: ParsedFeed,
    commonTags: Record<string, string>,
    disableWaitforOperations?: boolean
  ) => Promise.all(parsedFeed.configuration.entities.map((e) => createEntity(e, commonTags, disableWaitforOperations)));

  const forkIntegrationAndConnector = async (activeFeed: Feed, data: Data, skipTracking?: boolean) => {
    try {
      const { feed: parsedFeed } = await replaceMustache(data, activeFeed);

      const commonTags = getCommonTags(activeFeed, 'integration');

      if (!skipTracking) {
        trackEventMemoized('New Fork Create Button Clicked', 'Integrations', {
          integration: commonTags['fusebit.feedId'],
        });
      }

      const res = await createFromFeed(parsedFeed, commonTags, true);

      return res.find((r) => r.data.entityType === 'integration')?.data;
    } catch (e) {
      createError(e);
    }
  };

  const createIntegrationAndConnector = async (activeFeed: Feed, data: Data, skipTracking?: boolean) => {
    const commonTags = getCommonTags(activeFeed, 'integration');
    try {
      const { feed: parsedFeed } = await replaceMustache(data, activeFeed);

      if (!skipTracking) {
        trackEventMemoized('New Integration Create Button Clicked', 'Integrations', {
          integration: commonTags['fusebit.feedId'],
        });
      }

      const res = await createFromFeed(parsedFeed, commonTags, true);

      return res.find((r) => r.data.entityType === 'integration')?.data;
    } catch (e) {
      trackEvent('Integration Creation Failed', 'Integrations', {
        integration: commonTags['fusebit.feedId'],
      });

      createError(e);
    }
  };

  const createConnector = async (activeFeed: Feed, data: Data, skipTracking?: boolean) => {
    try {
      const { feed: parsedFeed } = await replaceMustache(data, activeFeed);

      const commonTags = getCommonTags(activeFeed, 'connector');

      if (!skipTracking) {
        trackEventMemoized('New Connector Create Button Clicked', 'Connectors', {
          connector: commonTags['fusebit.feedId'],
        });
      }

      const res = await createFromFeed(parsedFeed, commonTags);

      return res[0].data;
    } catch (e) {
      createError(e);
    }
  };

  const createAndAddConnectorToIntegration = async (
    activeFeed: Feed,
    data: Data,
    integrationData?: ApiResponse<Integration>
  ) => {
    try {
      const connector = await createConnector(activeFeed, data);

      const res = await addConnectorToIntegration(connector as Entity, integrationData);
      queryClient.invalidateQueries(ACCOUNT_INTEGRATIONS_GET_ONE, { active: true });

      return res;
    } catch (e) {
      createError(e);
    }
  };

  return {
    createIntegrationAndConnector,
    createConnector,
    createAndAddConnectorToIntegration,
    forkIntegrationAndConnector,
  };
};
