import { useQuery } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const useAccountConnectorsGetAll = <T>(params: Params) => {
  const { axios } = useAxios();

  const { enabled, ...queryParams } = params

  return useQuery(
    ['accountConnectorsGetAll', queryParams],
    () => axios<T>(`/v2/account/${queryParams.accountId}/subscription/${queryParams.subscriptionId}/connector`, 'get', params),
    { enabled: !!enabled }
  );
};
