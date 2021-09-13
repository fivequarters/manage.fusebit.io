import { useQuery } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const useAccountIntegrationsGetAll = <T>(params: Params) => {
  const { axios } = useAxios();

  const { enabled, ...queryParams } = params

  return useQuery(
    ['accountIntegrationsGetAll', queryParams],
    () => axios<T>(`/v2/account/${queryParams.accountId}/subscription/${queryParams.subscriptionId}/integration`, 'get', params),
    { enabled: !!enabled }
  );
};
