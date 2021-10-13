import { useQuery, UseQueryOptions } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios, FusebitAxios, ApiResponse } from '../../../../useAxios';

export const ACCOUNT_INTEGRATIONS_GET_ALL = 'accountIntegrationsGetAll';

export const getAllIntegrations = <T>(axiosInstance: FusebitAxios, params: Params, queryParams?: Params) => {
  return axiosInstance<T>(
    `/v2/account/${params.accountId}/subscription/${params.subscriptionId}/integration`,
    'get',
    params,
    {},
    queryParams
  );
};

export const useAccountIntegrationsGetAll = <T>(
  params: Params,
  options?: UseQueryOptions<unknown, unknown, ApiResponse<T>>
) => {
  const { axios } = useAxios();

  const { enabled, ...queryParams } = params;

  return useQuery([ACCOUNT_INTEGRATIONS_GET_ALL, queryParams], () => getAllIntegrations<T>(axios, queryParams), {
    enabled: !!enabled,
    ...options,
  });
};
