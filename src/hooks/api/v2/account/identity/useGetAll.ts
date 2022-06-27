import { useQuery } from 'react-query';
import { Params } from '@interfaces/api';
import { FusebitAxios, useAxios } from '@hooks/useAxios';
import { useAuthContext } from '@hooks/useAuthContext';
import { Identity } from '@interfaces/identities';

export const GET_ALL_ACCOUNT_IDENTITIES = 'GetAllAccountIdentities';

export const getAllAccountIdentities = <T>(axiosInstall: FusebitAxios, params: Params, queryParams?: Params) => {
  return axiosInstall<T>(
    `/v2/account/${params.accountId}/subscription/${params.subscriptionId}/identity`,
    'get',
    params,
    {},
    queryParams
  );
};

export const useGetAllAccountIdentities = <T = { items: Identity[] }>() => {
  const { axios } = useAxios();
  const { userData } = useAuthContext();

  const params = {
    subscriptionId: userData.subscriptionId,
    accountId: userData.accountId,
  };

  return useQuery([GET_ALL_ACCOUNT_IDENTITIES, params], () => getAllAccountIdentities<T>(axios, params), {
    enabled: !!userData.token,
  });
};
