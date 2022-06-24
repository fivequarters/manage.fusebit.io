import { useQuery } from 'react-query';
import { Params } from '@interfaces/api';
import { FusebitAxios, useAxios } from '@hooks/useAxios';
import { useAuthContext } from '@hooks/useAuthContext';
import { Identity } from '@interfaces/identities';

export const ACCOUNT_CONNECTORS_GET_ALL_ACROSS_CONNECTORS = 'accountConnectorIdentityGetAllAcrossConnectors';

export const getAllIdentities = <T>(axiosInstall: FusebitAxios, params: Params, queryParams?: Params) => {
  return axiosInstall<T>(
    `/v2/account/${params.accountId}/subscription/${params.subscriptionId}/identity`,
    'get',
    params,
    {},
    queryParams
  );
};

export const useAccountConnectorIdentityGetAllAcrossConnectors = <T = { items: Identity[] }>() => {
  const { axios } = useAxios();
  const { userData } = useAuthContext();

  const params = {
    subscriptionId: userData.subscriptionId,
    accountId: userData.accountId,
  };

  return useQuery([ACCOUNT_CONNECTORS_GET_ALL_ACROSS_CONNECTORS, params], () => getAllIdentities<T>(axios, params), {
    enabled: !!userData.token,
  });
};
