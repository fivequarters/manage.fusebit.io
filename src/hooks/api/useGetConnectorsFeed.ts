import { useQuery } from 'react-query';
import { connectorsFeed } from '../../static/feed';

export const useGetConnectorsFeed = () => useQuery('getConnectorsFeed', () => connectorsFeed());
