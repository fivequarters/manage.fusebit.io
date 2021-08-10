import { useQuery } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const useAccountUserGetOne = <T>(params: Params) => {
  const { axios } = useAxios();

  return useQuery('accountUserGetOne', () => axios<T>(`/v1/account/${params.accountId}/user/${params.userId}`, 'get'), {
    enabled: !!params.enabled,
  });
};
