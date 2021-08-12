import { useQuery } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const useAccountConnectorsGetOneConfig = <T>(params: Params) => {
  const { axios } = useAxios();

  return useQuery(
    'accountConnectorsGetOneConfig',
    () =>
      axios<T>(
        `/v2/account/${params.accountId}/subscription/${params.subscriptionId}/connector/${params.id}/api/configure`,
        'get',
        params
      ),
    { enabled: !!params.enabled }
  );
};
