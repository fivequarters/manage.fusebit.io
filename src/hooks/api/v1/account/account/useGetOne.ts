import { useQuery } from 'react-query';
import { Params } from '@interfaces/api';
import { FusebitAxios, useAxios } from '@hooks/useAxios';

export const getOne = <T>(axiosInstance: FusebitAxios, params: Params, queryParams?: Params) => {
  return axiosInstance<T>(`/v1/account/${params.accountId}`, 'get', params, {}, queryParams);
};

export const useAccountGetOne = <T>(params: Params) => {
  const { axios } = useAxios();
  const { enabled, ...queryParams } = params;

  return useQuery(['accountGetOne'], () => axios<T>(`/v1/account/${queryParams.accountId}`, 'get', params), {
    enabled: !!enabled,
  });
};
