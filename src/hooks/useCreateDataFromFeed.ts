import { useReplaceMustache } from './useReplaceMustache';
import { Entity, Feed, ParsedFeed } from '../interfaces/feed';
import { Data } from '../interfaces/feedPicker';
import { useError } from './useError';
import { useEntityApi } from './useEntityApi';
import { trackEvent } from '../utils/analytics';
import { Integration } from '../interfaces/integration';
import { ApiResponse } from './useAxios';

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

  const createFromFeed = async (parsedFeed: ParsedFeed, commonTags: Record<string, string>) =>
    Promise.all(parsedFeed.configuration.entities.map((e) => createEntity(e, commonTags)));

  const createIntegrationAndConnector = async (activeFeed: Feed, data: Data) => {
    try {
      const parsedFeed = await replaceMustache(data, activeFeed);

      const commonTags = getCommonTags(activeFeed, 'integration');

      trackEvent('New Integration Create Button Clicked', 'Integrations', {
        integration: commonTags['fusebit.feedId'],
      });

      const res = await createFromFeed(parsedFeed, commonTags);

      return {
        connector: res[0].data,
        integration: res[1].data,
      };
    } catch (e) {
      createError(e);
    }
  };

  const createConnector = async (activeFeed: Feed, data: Data) => {
    try {
      const parsedFeed = await replaceMustache(data, activeFeed);

      const commonTags = getCommonTags(activeFeed, 'connector');

      trackEvent('New Connector Create Button Clicked', 'Connectors', { connector: commonTags['fusebit.feedId'] });

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

      return res;
    } catch (e) {
      createError(e);
    }
  };

  return {
    createIntegrationAndConnector,
    createConnector,
    createAndAddConnectorToIntegration,
  };
};
