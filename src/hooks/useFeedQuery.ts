import { useQuery } from '@hooks/useQuery';

export const useFeedQuery = () => {
  const query = useQuery();
  const forkFeedUrl = query.get('forkFeedUrl');

  if (!forkFeedUrl) {
    return {
      integrationsFeedQueryKey: `getIntegrationsFeed`,
      isFork: false,
    };
  }

  return {
    forkFeedUrl,
    integrationsFeedQueryKey: ['getIntegrationsForkFeed', forkFeedUrl],
    isFork: true,
  };
};
