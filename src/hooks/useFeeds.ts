import { useGetConnectorsFeed } from './useGetConnectorsFeed';
import { useGetIntegrationsFeed } from './useGetIntegrationsFeed';

const useFeeds = () => {
  useGetIntegrationsFeed({
    cacheTime: Infinity,
  });

  useGetConnectorsFeed({
    cacheTime: Infinity,
  });
};

export default useFeeds;
