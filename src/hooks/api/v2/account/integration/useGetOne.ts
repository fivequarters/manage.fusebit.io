import { useQuery } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const useAccountIntegrationsGetOne = <T>(params: Params) => {
  const { axios } = useAxios();

  return useQuery(
    'accountIntegrationsGetOne',
    () =>
      axios<T>(
        `/v2/account/${params.accountId}/subscription/${params.subscriptionId}/integration/${params.id}`,
        'get',
        params
      ),
    { enabled: !!params.enabled }
  );
};
