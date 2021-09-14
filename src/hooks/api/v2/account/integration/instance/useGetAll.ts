import { useQuery } from 'react-query';
import { Params } from '../../../../../../interfaces/api';
import { useAxios } from '../../../../../useAxios';

export const useAccountIntegrationInstanceGetAll = <T>(params: Params) => {
  const { axios } = useAxios();

  const { enabled, ...queryParams } = params;

  return useQuery(
    ['accountIntegrationInstanceGetAll', queryParams],
    () =>
      axios<T>(
        `/v2/account/${queryParams.accountId}/subscription/${queryParams.subscriptionId}/integration/${queryParams.id}/instance`,
        'get',
        params
      ),
    { enabled: !!enabled }
  );
};
