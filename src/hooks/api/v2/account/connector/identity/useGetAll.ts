import { useQuery, UseQueryOptions } from 'react-query';
import { Params } from '../../../../../../interfaces/api';
import { ApiResponse, useAxios } from '../../../../../useAxios';
import { useContext } from '../../../../../useContext';

export const useAccountConnectorIdentityGetAll = <T>(
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
    ['accountConnectorIdentityGetAll', params],
    () =>
      axios<T>(
        `/v2/account/${params.accountId}/subscription/${params.subscriptionId}/connector/${params.id}/identity`,
        'get',
        params
      ),
    {
      enabled: !!userData.token,
      ...options,
    }
  );
};
