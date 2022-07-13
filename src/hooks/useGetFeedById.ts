import { useState, useEffect } from 'react';
import { Feed } from '@interfaces/feed';
import { integrationsFeed, connectorsFeed } from '../static/feed';

export const useGetFeedById = ({ id, type }: { id: string; type: 'integration' | 'connector' }) => {
  const [feed, setFeedEntry] = useState<Feed | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const findFeedEntry = (feeds: Feed[]) => setFeedEntry(feeds.find((f: Feed) => f.id === id));
    if (type === 'integration') {
      integrationsFeed().then((feeds) => {
        findFeedEntry(feeds);
        setIsLoading(false);
      });
    } else if (type === 'connector') {
      connectorsFeed().then((feeds) => {
        findFeedEntry(feeds);
        setIsLoading(false);
      });
    }
  }, [id, type]);

  return { feed, isLoading };
};
