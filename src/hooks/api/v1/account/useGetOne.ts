import { useQuery } from 'react-query';
import { Params } from '../../../../interfaces/api';
import { useAxios } from '../../../useAxios';

export const useAccountGetOne = <T>(params: Params) => {
  const { axios } = useAxios();

  const { enabled, ...queryParams } = params

  return useQuery(['accountGetOne', queryParams], () => axios<T>(`/v1/account/${queryParams.accountId}`, 'get'), {
    enabled: !!params.enabled,
  });
};
