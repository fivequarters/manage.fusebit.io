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

  // test url is:
  // http://localhost:3000?forkFeedUrl=http://localhost:3001/v2/account/acc-a1895767bfe249fd/subscription/sub-dfe4c6b5cd3744cb/integration/feed-test/api/feed/integration/reddit-test-integration
  return {
    forkFeedUrl,
    integrationsFeedQueryKey: ['getIntegrationsForkFeed', forkFeedUrl],
    isFork: true,
  };
};
