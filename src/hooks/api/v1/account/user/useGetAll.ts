import { useQuery } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const ACCOUNT_USER_GET_ALL = 'accountUserGetAll';

export const useAccountUserGetAll = <T>(params: Params) => {
  const { axios } = useAxios();

  const { enabled, ...queryParams } = params;

  return useQuery(
    // TODO: When dynamic queryparams are integrated include them in the key. Now 'include=all' is hardcoded.
    [ACCOUNT_USER_GET_ALL, { accountId: queryParams.accountId }],
    () => axios<T>(`/v1/account/${queryParams.accountId}/user`, 'get', params),
    {
      enabled: !!enabled,
    }
  );
};
