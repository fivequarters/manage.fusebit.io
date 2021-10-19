import { useQuery } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const ACCOUNT_CONNECTORS_GET_ONE_CONFIG = 'accountConnectorsGetOneConfig';

export const useAccountConnectorsGetOneConfig = <T>(params: Params) => {
  const { axios } = useAxios();

  const { enabled, ...queryParams } = params;

  return useQuery(
    [ACCOUNT_CONNECTORS_GET_ONE_CONFIG, queryParams],
    () =>
      axios<T>(
        `/v2/account/${queryParams.accountId}/subscription/${queryParams.subscriptionId}/connector/${queryParams.id}/api/configure`,
        'get',
        params
      ),
    { enabled: !!enabled }
  );
};
