import { useEffect } from 'react';
import { useQuery } from './useQuery';

interface Props {
  onHasKey: (key: string) => void;
}

const useKey = ({ onHasKey }: Props) => {
  const query = useQuery();

  const key = query.get('key');

  useEffect(() => {
    if (key) {
      onHasKey(key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useKey;
