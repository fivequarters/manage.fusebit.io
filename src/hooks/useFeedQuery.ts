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

  const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;
  // const integrationsFeedUrl = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v2/account/${accountId}/subscription/${subscriptionId}/integration/${shareIntegrationId}/api/feed/integration/${forkIntegrationId}`;
  // const integrationsFeedUrl = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v2/account/${accountId}/subscription/${subscriptionId}/integration/${shareIntegrationId}/api/integrationsFeed.json`;

  // test url is:
  // http://localhost:3000?forkFeedUrl=http://localhost:3001/v2/account/acc-a1895767bfe249fd/subscription/sub-dfe4c6b5cd3744cb/integration/feed-test/api/feed/integration/reddit-test-integration
  // http://localhost:3000?forkAccountId=acc-a1895767bfe249fd&forkSubscriptionId=sub-dfe4c6b5cd3744cb&shareIntegrationId=feed-test&forkIntegrationId=reddit-test-integration&forkConnectorId=replaceme
  return {
    forkFeedUrl,
    integrationsFeedQueryKey: ['getIntegrationsForkFeed', forkFeedUrl],
    isFork: true,
  };
};
