import { useQuery } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const useAccountConnectorsGetOne = <T>(params: Params) => {
  const { axios } = useAxios();

  return useQuery(
    'accountConnectorsGetOne',
    () =>
      axios<T>(
        `/v2/account/${params.accountId}/subscription/${params.subscriptionId}/connector/${params.id}`,
        'get',
        params
      ),
    { enabled: !!params.enabled }
  );
};
