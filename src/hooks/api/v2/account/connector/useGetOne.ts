import { useQuery } from 'react-query';
import { Params } from '@interfaces/api';
import { useAxios } from '@hooks/useAxios';
import { Connector } from '@interfaces/connector';

export const ACCOUNT_CONNECTORS_GET_ONE = 'accountConnectorsGetOne';

export const useAccountConnectorsGetOne = <T = Connector>(params: Params) => {
  const { axios } = useAxios();

  const { enabled, ...queryParams } = params;

  return useQuery(
    [ACCOUNT_CONNECTORS_GET_ONE, queryParams],
    () =>
      axios<T>(
        `/v2/account/${queryParams.accountId}/subscription/${queryParams.subscriptionId}/connector/${queryParams.id}`,
        'get',
        params
      ),
    { enabled: !!enabled }
  );
};
