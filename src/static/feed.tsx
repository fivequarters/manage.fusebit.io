import http from 'http';
import { Feed } from '@interfaces/feed';

const { REACT_APP_INTEGRATIONS_FEED_URL, REACT_APP_CONNECTORS_FEED_URL } = process.env;

export const integrationsFeed = async (): Promise<Feed[]> => {
  return new Promise((accept) => {
    console.warn('########################### SECONDARY FUNCTION IS FETCHING');
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
