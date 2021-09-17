import { useQuery, UseQueryOptions } from 'react-query';
import { Params } from '../../../../../../interfaces/api';
import { ApiResponse, FusebitAxios, useAxios } from '../../../../../useAxios';
import { useContext } from '../../../../../useContext';

export const getAllInstances = <T>(axiosInstance: FusebitAxios, params: Params) => {
  return axiosInstance<T>(
    `/v2/account/${params.accountId}/subscription/${params.subscriptionId}/integration/${params.id}/instance`,
    'get',
    params
  );
};

export const ACCOUNT_INTEGRATION_INSTANCE_GET_ALL = 'accountIntegrationInstanceGetAll';

export const useAccountIntegrationInstanceGetAll = <T>(
  { id }: Params,
  options?: UseQueryOptions<unknown, unknown, ApiResponse<T>>
) => {
  const { axios } = useAxios();
  const { userData } = useContext();

  const params = {
    subscriptionId: userData.subscriptionId,
    accountId: userData.accountId,
    id,
  };

  return useQuery([ACCOUNT_INTEGRATION_INSTANCE_GET_ALL, params], () => getAllInstances<T>(axios, params), {
    enabled: !!userData.token,
    ...options,
  });
};
