import { useQuery } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const ACCOUNT_USER_GET_ALL = 'accountUserGetAll';

export const useAccountUserGetAll = <T>(params: Params) => {
  const { axios } = useAxios();

  return useQuery(ACCOUNT_USER_GET_ALL, () => axios<T>(`/v1/account/${params.accountId}/user`, 'get', params), {
    enabled: !!params.enabled,
  });
};
