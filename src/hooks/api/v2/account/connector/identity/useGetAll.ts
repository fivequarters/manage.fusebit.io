import { useQuery, UseQueryOptions } from 'react-query';
import { Params } from '@interfaces/api';
import { ApiResponse, FusebitAxios, useAxios } from '@hooks/useAxios';
import { useAuthContext } from '@hooks/useAuthContext';

export const getAllIdentities = <T>(axiosInstance: FusebitAxios, params: Params) => {
  return axiosInstance<T>(
    `/v2/account/${params.accountId}/subscription/${params.subscriptionId}/connector/${params.id}/identity`,
    'get',
    params
  );
};

export const ACCOUNT_CONNECTOR_IDENTITY_GET_ALL = 'accountConnectorIdentityGetAll';

export const useAccountConnectorIdentityGetAll = <T>(
  { id }: Params,
  options?: UseQueryOptions<unknown, unknown, ApiResponse<T>>
) => {
  const { axios } = useAxios();
  const { userData } = useAuthContext();

  const params = {
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  };

  return useQuery(
    [ACCOUNT_CONNECTOR_IDENTITY_GET_ALL, params],
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
