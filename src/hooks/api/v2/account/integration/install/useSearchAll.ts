import { useQuery } from 'react-query';
import { Params } from '@interfaces/api';
import { FusebitAxios, useAxios } from '@hooks/useAxios';
import { Install } from '@interfaces/install';
import { useAuthContext } from '@hooks/useAuthContext';

export const ACCOUNT_INTEGRATIONS_GET_ALL_ACROSS_INTEGRATIONS = 'accountIntegrationInstallGetAllAcrossIntegrations';

export const getAllInstalls = <T>(axiosInstall: FusebitAxios, params: Params, queryParams?: Params) => {
  return axiosInstall<T>(
    `/v2/account/${params.accountId}/subscription/${params.subscriptionId}/install`,
    'get',
    params,
    {},
    queryParams
  );
};

export const useAccountIntegrationInstallGetAllAcrossIntegrations = <T = { items: Install[] }>() => {
  const { axios } = useAxios();
  const { userData } = useAuthContext();

  const params = {
    subscriptionId: userData.subscriptionId,
    accountId: userData.accountId,
  };

  return useQuery([ACCOUNT_INTEGRATIONS_GET_ALL_ACROSS_INTEGRATIONS, params], () => getAllInstalls<T>(axios, params), {
    enabled: !!userData.token,
  });
};
