import { useQuery } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { Integration } from '../../../../../interfaces/integration';
import { useAxios } from '../../../../useAxios';

export const ACCOUNT_INTEGRATIONS_GET_ONE = 'accountIntegrationsGetOne';

export const useAccountIntegrationsGetOne = <T = Integration>(params: Params) => {
  const { axios } = useAxios();

  const { enabled, ...queryParams } = params;

  return useQuery(
    [ACCOUNT_INTEGRATIONS_GET_ONE, queryParams],
    () =>
      axios<T>(
        `/v2/account/${queryParams.accountId}/subscription/${queryParams.subscriptionId}/integration/${queryParams.id}`,
        'get',
        params
      ),
    { enabled: !!enabled }
  );
};
