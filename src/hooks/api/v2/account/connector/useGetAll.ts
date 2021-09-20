import { useQuery } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { FusebitAxios, useAxios } from '../../../../useAxios';

export const ACCOUNT_CONNECTORS_GET_ALL = 'accountConnectorsGetAll';

export const getAllConnectors = <T>(axiosInstance: FusebitAxios, params: Params) => {
  return axiosInstance<T>(
    `/v2/account/${params.accountId}/subscription/${params.subscriptionId}/connector`,
    'get',
    params
  );
};

export const useAccountConnectorsGetAll = <T>(params: Params) => {
  const { axios } = useAxios();

  const { enabled, ...queryParams } = params;

  return useQuery(
    [ACCOUNT_CONNECTORS_GET_ALL, queryParams],
    () =>
      axios<T>(
        `/v2/account/${queryParams.accountId}/subscription/${queryParams.subscriptionId}/connector`,
        'get',
        params
      ),
    { enabled: !!enabled }
  );
};
