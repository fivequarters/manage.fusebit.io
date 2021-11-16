import http from 'http';
import { Params } from '@interfaces/api';
import { Feed } from '@interfaces/feed';
import { useQuery } from 'react-query';

const { REACT_APP_CONNECTORS_FEED_URL } = process.env;

export const connectorsFeed = async (): Promise<Feed[]> => {
  return new Promise((accept) => {
    const req = http.get(REACT_APP_CONNECTORS_FEED_URL || 'http://localhost:3000/feed/connectorsFeed.json', (res) => {
      let data = '';
      res.on('data', (stream) => {
        data += stream;
      });
      res.on('end', () => accept(JSON.parse(data)));
    });
    req.on('error', () => {
      accept([]);
    });
  });
};

export const useGetConnectorsFeed = (params: Params) => {
  return useQuery(['getConnectorsFeed'], connectorsFeed, {
    enabled: !!params.enabled,
  });
};
