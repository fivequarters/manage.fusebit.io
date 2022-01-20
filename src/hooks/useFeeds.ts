import { useGetConnectorsFeed } from './useGetConnectorsFeed';
import { useGetIntegrationsFeed } from './useGetIntegrationsFeed';
import { useGetIntegrationsForkFeed } from './useGetIntegrationsForkFeed';

const useFeeds = () => {
  useGetIntegrationsFeed({
    cacheTime: Infinity,
  });

  useGetConnectorsFeed({
    cacheTime: Infinity,
  });

  useGetIntegrationsForkFeed({
    cacheTime: Infinity,
  });
};

export default useFeeds;
