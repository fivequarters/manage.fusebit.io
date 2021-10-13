import { useQuery, UseQueryOptions } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { ApiResponse, useAxios } from '../../../../useAxios';

export const ACCOUNT_USER_GET_ALL = 'accountUserGetAll';

export const useAccountUserGetAll = <T>(
  params: Params,
  options?: UseQueryOptions<unknown, unknown, ApiResponse<T>>
) => {
  const { axios } = useAxios();

  const { enabled, ...queryParams } = params;

  return useQuery(
    // TODO: When dynamic queryparams are integrated include them in the key. Now 'include=all' is hardcoded.
    [ACCOUNT_USER_GET_ALL, { accountId: queryParams.accountId }],
    () => axios<T>(`/v1/account/${queryParams.accountId}/user`, 'get', params),
    {
      enabled: !!enabled,
      ...options,
    }
  );
};
