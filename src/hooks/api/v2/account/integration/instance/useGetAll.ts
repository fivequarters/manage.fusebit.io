import { useQuery, UseQueryOptions } from 'react-query';
import { Params } from '../../../../../../interfaces/api';
import { ApiResponse, useAxios } from '../../../../../useAxios';
import { useContext } from '../../../../../useContext';

export const ACCOUNT_INTEGRATION_INSTANCE_GET_ALL = 'accountIntegrationInstanceGetAll';

export const useAccountIntegrationInstanceGetAll = <T>(
  { id }: Params,
  options?: UseQueryOptions<unknown, unknown, ApiResponse<T>>
) => {
  const { axios } = useAxios();
  const { userData } = useContext();

  const params = {
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  };

  return useQuery(
    [ACCOUNT_INTEGRATION_INSTANCE_GET_ALL, params],
    () =>
      axios<T>(
        `/v2/account/${params.accountId}/subscription/${params.subscriptionId}/integration/${params.id}/instance`,
        'get',
        params
      ),
    {
      enabled: !!userData.token,
      ...options,
    }
  );
};
