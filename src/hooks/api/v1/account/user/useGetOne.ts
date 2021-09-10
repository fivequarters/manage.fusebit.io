import { useQuery } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const useAccountUserGetOne = <T>(params: Params) => {
  const { axios } = useAxios();

  const { enabled, ...queryParams } = params

  return useQuery(['accountUserGetOne', queryParams], () => axios<T>(`/v1/account/${queryParams.accountId}/user/${queryParams.userId}`, 'get'), {
    enabled: !!params.enabled,
  });
};
