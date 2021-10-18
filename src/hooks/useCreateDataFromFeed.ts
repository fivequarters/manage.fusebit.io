import { useHistory } from 'react-router-dom';
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
  const { getRedirectLink } = useGetRedirectLink();
  const { replaceMustache } = useReplaceMustache();
  const { createLoader, removeLoader } = useLoader();
  const { createEntity } = useEntityApi();
  const { createError } = useError();

  const getCommonTags = (feed: Feed) => {
    return {
      'fusebit.feedType': 'integration',
      'fusebit.feedId': feed.id,
    };
  };

  const parseEntity = async (activeFeed: Feed, data: Data, entityType: 'integration' | 'connector') => {
    const parsedFeed = await replaceMustache(data, activeFeed);

    return {
      firstEntity: parsedFeed.configuration.entities.find((entity: Entity) => entity.entityType === entityType),
      parsedFeed,
    };
  };

  const createIntegrationFromFeed = async (activeFeed: Feed, data: Data) => {
    try {
      createLoader();

      const { firstEntity, parsedFeed } = await parseEntity(activeFeed, data, 'integration');

      const commonTags = getCommonTags(activeFeed);

      trackEvent('New Integration Create Button Clicked', 'Integrations', {
        integration: commonTags['fusebit.feedId'],
      });

      await Promise.all([
        ...parsedFeed.configuration.entities.map(async (e: Entity) => {
          await createEntity(e, commonTags);
        }),
      ]);

      removeLoader();

      history.push(getRedirectLink(`/integration/${firstEntity?.id}/develop`));
    } catch (e) {
      createError(e);
      removeLoader();
      return false;
    }
  };

  const createConnectorFromFeed = async (activeFeed: Feed, data: Data) => {
    try {
      createLoader();

      const { firstEntity, parsedFeed } = await parseEntity(activeFeed, data, 'connector');

      const commonTags = getCommonTags(activeFeed);

      trackEvent('New Connector Create Button Clicked', 'Connectors', { connector: commonTags['fusebit.feedId'] });

      await Promise.all([
        ...parsedFeed.configuration.entities.map(async (e: Entity) => {
          await createEntity(e, commonTags);
        }),
      ]);

      removeLoader();

      history.push(getRedirectLink(`/connector/${firstEntity?.id}/configure`));
    } catch (e) {
      createError(e);
      removeLoader();
      return false;
    }
  };

  return {
    createIntegrationFromFeed,
    createConnectorFromFeed,
    parseEntity,
    getCommonTags,
  };
};
