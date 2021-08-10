import { useQuery } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const useAccountUserGetAll = <T>(params: Params) => {
  const { axios } = useAxios();

  return useQuery('accountUserGetAll', () => axios<T>(`/v1/account/${params.accountId}/user`, 'get', params), {
    enabled: !!params.enabled,
  });
};
