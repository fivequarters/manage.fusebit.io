import { useQuery } from 'react-query';
import { Params } from '@interfaces/api';
import { useAxios } from '@hooks/useAxios';
import { Connector } from '@interfaces/connector';

export const useAccountConnectorsGetOne = <T = Connector>(params: Params) => {
  const { axios } = useAxios();

  const { enabled, ...queryParams } = params;

  return useQuery(
    ['accountConnectorsGetOne', queryParams],
    () =>
      axios<T>(
        `/v2/account/${queryParams.accountId}/subscription/${queryParams.subscriptionId}/connector/${queryParams.id}`,
        'get',
        params
      ),
    { enabled: !!enabled }
  );
};
