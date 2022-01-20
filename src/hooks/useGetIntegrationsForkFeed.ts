import http from 'http';
import { Feed } from '@interfaces/feed';
import { useQuery, UseQueryOptions } from 'react-query';
import { useFeedQuery } from '@hooks/useFeedQuery';

export const integrationsForkFeed = async (url?: string): Promise<Feed | undefined> => {
  if (!url) {
    return;
  }
  return new Promise((accept) => {
    console.log('fetching: ', url);
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (stream) => {
        data += stream;
      });
      res.on('end', () => {
        return accept(JSON.parse(data));
      });
    });
    req.on('error', () => {
      accept(undefined);
    });
  });
};

export const useGetIntegrationsForkFeed = (options?: UseQueryOptions<Feed | undefined>) => {
  console.log('FEED: fetching forks');
  const { integrationsFeedUrl, integrationsFeedQueryKey } = useFeedQuery();
  return useQuery(integrationsFeedQueryKey, () => integrationsForkFeed(integrationsFeedUrl), options);
};
