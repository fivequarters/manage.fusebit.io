import { useReplaceMustache } from './useReplaceMustache';
import { Entity, Feed, ParsedFeed } from '../interfaces/feed';
import { Data } from '../interfaces/feedPicker';
import { useLoader } from './useLoader';
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
  const { createLoader, removeLoader } = useLoader();
  const { createEntity, addConnectorToIntegration } = useEntityApi();
  const { createError } = useError();

  const parseEntity = async (activeFeed: Feed, data: Data) => {
    const parsedFeed = await replaceMustache(data, activeFeed);

    return {
      parsedFeed,
    };
  };

  const createFromFeed = async (parsedFeed: ParsedFeed, commonTags: Record<string, string>) =>
    Promise.all(parsedFeed.configuration.entities.map((e) => createEntity(e, commonTags)));

  const createIntegrationFromFeed = async (activeFeed: Feed, data: Data) => {
    try {
      createLoader();

      const { parsedFeed } = await parseEntity(activeFeed, data);

      const commonTags = getCommonTags(activeFeed, 'integration');

      trackEvent('New Integration Create Button Clicked', 'Integrations', {
        integration: commonTags['fusebit.feedId'],
      });

      const res = await createFromFeed(parsedFeed, commonTags);

      removeLoader();

      return res[0].data;

      // history.push(getRedirectLink(`/integration/${firstEntity?.id}/develop`));
    } catch (e) {
      createError(e);
      removeLoader();
      return false;
    }
  };

  const createConnectorFromFeed = async (activeFeed: Feed, data: Data) => {
    try {
      createLoader();

      const { parsedFeed } = await parseEntity(activeFeed, data);

      const commonTags = getCommonTags(activeFeed, 'connector');

      trackEvent('New Connector Create Button Clicked', 'Connectors', { connector: commonTags['fusebit.feedId'] });

      const res = await createFromFeed(parsedFeed, commonTags);

      removeLoader();

      return res[0].data;
    } catch (e) {
      createError(e);
      removeLoader();
    }
  };

  const createAndAddConnectorToIntegration = async (
    activeFeed: Feed,
    data: Data,
    integrationData: ApiResponse<Integration>
  ) => {
    const connector = await createConnectorFromFeed(activeFeed, data);

    return addConnectorToIntegration(connector as Entity, integrationData);
  };

  return {
    createIntegrationFromFeed,
    createConnectorFromFeed,
    createAndAddConnectorToIntegration,
  };
};
