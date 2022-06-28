import { useQuery } from 'react-query';
import { Params } from '@interfaces/api';
import { FusebitAxios, useAxios } from '@hooks/useAxios';
import { Install } from '@interfaces/install';
import { useAuthContext } from '@hooks/useAuthContext';

export const GET_ALL_ACCOUNT_INSTALLS = 'getAllAccountIntegrations';

export const getAllAccountInstalls = <T>(axiosInstall: FusebitAxios, params: Params, queryParams?: Params) => {
  return axiosInstall<T>(
    `/v2/account/${params.accountId}/subscription/${params.subscriptionId}/install`,
    'get',
    params,
    {},
    queryParams
  );
};

export const useGetAllAccountInstalls = <T = { items: Install[] }>() => {
  const { axios } = useAxios();
  const { userData } = useAuthContext();

  const params = {
    subscriptionId: userData.subscriptionId,
    accountId: userData.accountId,
  };

  return useQuery([GET_ALL_ACCOUNT_INSTALLS, params], () => getAllAccountInstalls<T>(axios, params), {
    enabled: !!userData.token,
  });
};
