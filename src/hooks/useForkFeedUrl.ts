import { useQuery } from '@hooks/useQuery';

export const useForkFeedUrl = () => {
  const query = useQuery();
  return query.get('forkEditFeedUrl');
};
