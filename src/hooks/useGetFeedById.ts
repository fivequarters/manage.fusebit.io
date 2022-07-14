import { useState, useEffect } from 'react';
import { Feed } from '@interfaces/feed';
import { useGetIntegrationsFeed } from './useGetIntegrationsFeed';
import { useGetConnectorsFeed } from './useGetConnectorsFeed';

export const useGetFeedById = ({ id, type }: { id: string; type: 'integration' | 'connector' }) => {
  const [feed, setFeedEntry] = useState<Feed | undefined>();
  const { data: integrationFeed, isLoading: isLoadingIntegrationFeed } = useGetIntegrationsFeed();
  const { data: connectorFeed, isLoading: isLoadingConnectorFeed } = useGetConnectorsFeed();

  useEffect(() => {
    const findFeedEntry = (feeds?: Feed[]) => setFeedEntry((feeds || []).find((f: Feed) => f.id === id));
    if (type === 'integration') {
      findFeedEntry(integrationFeed);
    } else if (type === 'connector') {
      findFeedEntry(connectorFeed);
    }
  }, [connectorFeed, id, integrationFeed, type]);

  return { feed, isLoading: isLoadingIntegrationFeed || isLoadingConnectorFeed };
};
