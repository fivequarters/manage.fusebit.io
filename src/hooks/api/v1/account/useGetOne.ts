import { useQuery } from 'react-query';
import { Params } from '@interfaces/api';
import { useAxios } from '@hooks/useAxios';

export const useAccountGetOne = <T>(params: Params) => {
  const { axios } = useAxios();

  return useQuery(['accountGetOne', params.accountId], () => axios<T>(`/v1/account/${params.accountId}`, 'get'), {
    enabled: !!params.enabled,
  });
};
