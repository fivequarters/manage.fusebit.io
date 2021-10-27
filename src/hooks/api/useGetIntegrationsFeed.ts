import { useQuery } from 'react-query';
import { integrationsFeed } from '../../static/feed';

export const useGetIntegrationsFeed = () => useQuery('getIntegrationsFeed', integrationsFeed);
