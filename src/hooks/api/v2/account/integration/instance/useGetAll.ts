import { useQuery } from 'react-query';
import { Params } from '../../../../../../interfaces/api';
import { useAxios } from '../../../../../useAxios';

export const useAccountIntegrationInstanceGetAll = <T>(params: Params) => {
  const { axios } = useAxios();

  return useQuery(
    'accountIntegrationInstanceGetAll',
    () =>
      axios<T>(
        `/v2/account/${params.accountId}/subscription/${params.subscriptionId}/integration/${params.id}/instance`,
        'get',
        params
      ),
    { enabled: !!params.enabled }
  );
};
