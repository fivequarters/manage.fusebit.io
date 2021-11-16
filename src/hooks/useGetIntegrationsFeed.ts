import http from 'http';
import { Params } from '@interfaces/api';
import { Feed } from '@interfaces/feed';
import { useQuery } from 'react-query';

const { REACT_APP_INTEGRATIONS_FEED_URL } = process.env;

export const integrationsFeed = async (): Promise<Feed[]> => {
  return new Promise((accept) => {
    const req = http.get(
      REACT_APP_INTEGRATIONS_FEED_URL || 'http://localhost:3000/feed/integrationsFeed.json',
      (res) => {
        let data = '';
        res.on('data', (stream) => {
          data += stream;
        });
        res.on('end', () => accept(JSON.parse(data)));
      }
    );
    req.on('error', () => {
      accept([]);
    });
  });
};

export const useGetIntegrationsFeed = (params: Params) => {
  return useQuery(['getIntegrationsFeed'], integrationsFeed, {
    enabled: !!params.enabled,
  });
};
