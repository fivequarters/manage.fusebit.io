import { useQuery } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const ACCOUNT_INTEGRATIONS_GET_ALL = 'accountIntegrationsGetAll';

export const useAccountIntegrationsGetAll = <T>(params: Params) => {
  const { axios } = useAxios();

  return useQuery(
    ACCOUNT_INTEGRATIONS_GET_ALL,
    () => axios<T>(`/v2/account/${params.accountId}/subscription/${params.subscriptionId}/integration`, 'get', params),
    { enabled: !!params.enabled }
  );
};
