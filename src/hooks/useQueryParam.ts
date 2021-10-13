import { useEffect } from 'react';
import { useQuery } from './useQuery';

interface Props {
  onSet: (key: string) => void;
  param: string;
}

const useQueryParam = ({ onSet, param }: Props) => {
  const query = useQuery();

  const _param = query.get(param);

  useEffect(() => {
    if (_param) {
      onSet(_param);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useQueryParam;
