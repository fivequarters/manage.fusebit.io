import { useQuery } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const ACCOUNT_USER_GET_ALL = 'accountUserGetAll';

export const useAccountUserGetAll = <T>(params: Params) => {
  const { axios } = useAxios();

  const { enabled, ...queryParams } = params;

  return useQuery(
    [ACCOUNT_USER_GET_ALL, queryParams],
    () => axios<T>(`/v1/account/${queryParams.accountId}/user`, 'get', params),
    {
      enabled: !!enabled,
    }
  );
};
