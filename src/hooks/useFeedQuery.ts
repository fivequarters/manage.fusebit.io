import { useQuery } from '@hooks/useQuery';

export const useFeedQuery = () => {
  console.log('rendering feed memo');
  const query = useQuery();
  const accountId = query.get('forkAccountId');
  const subscriptionId = query.get('forkSubscriptionId');
  const shareIntegrationId = query.get('shareIntegrationId');
  const forkIntegrationId = query.get('forkIntegrationId');
  const forkConnectorId = query.get('forkConnectorId');

  if (!accountId || !subscriptionId || !shareIntegrationId || !forkIntegrationId || !forkConnectorId) {
    return {
      integrationsFeedQueryKey: `getIntegrationsFeed`,
      connectorsFeedQueryKey: `getConnectorsFeed`,
      isFork: false,
    };
  }

  const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;
  // const integrationsFeedUrl = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v2/account/${accountId}/subscription/${subscriptionId}/integration/${shareIntegrationId}/api/feed/integration/${forkIntegrationId}`;
  const integrationsFeedUrl = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v2/account/${accountId}/subscription/${subscriptionId}/integration/${shareIntegrationId}/api/integrationsFeed.json`;

  // test url is:
  // http://localhost:3000/account/acc-a1895767bfe249fd/subscription/sub-dfe4c6b5cd3744cb/integrations/overview?forkAccountId=acc-a1895767bfe249fd&forkSubscriptionId=sub-dfe4c6b5cd3744cb&shareIntegrationId=feed-test&forkIntegrationId=replaceme&forkConnectorId=replaceme
  const connectorsFeedUrl = undefined;

  return {
    integrationsFeedUrl,
    connectorsFeedUrl,
    integrationsFeedQueryKey: ['getIntegrationsForkFeed', integrationsFeedUrl],
    isFork: true,
  };
};
