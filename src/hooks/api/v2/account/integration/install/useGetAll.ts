import { useQuery, UseQueryOptions } from 'react-query';
import { Params } from '@interfaces/api';
import { Install } from '@interfaces/install';
import { ApiResponse, FusebitAxios, useAxios } from '@hooks/useAxios';
import { useAuthContext } from '@hooks/useAuthContext';

export const getAllInstalls = <T>(axiosInstall: FusebitAxios, params: Params, queryParams?: Params) => {
  return axiosInstall<T>(
    `/v2/account/${params.accountId}/subscription/${params.subscriptionId}/integration/${params.id}/install`,
    'get',
    params,
    {},
    queryParams
  );
};

export const ACCOUNT_INTEGRATION_INSTALL_GET_ALL = 'accountIntegrationInstallGetAll';

export const useAccountIntegrationInstallGetAll = <T = Install>(
  { id }: Params,
  options?: UseQueryOptions<unknown, unknown, ApiResponse<T>>
) => {
  const { axios } = useAxios();
  const { userData } = useAuthContext();

  const params = {
    subscriptionId: userData.subscriptionId,
    accountId: userData.accountId,
    id,
  };

  return useQuery([ACCOUNT_INTEGRATION_INSTALL_GET_ALL, params], () => getAllInstalls<T>(axios, params), {
    enabled: !!userData.token,
    ...options,
  });
};
