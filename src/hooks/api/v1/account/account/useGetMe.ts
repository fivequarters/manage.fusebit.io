import { useQuery } from 'react-query';
import { Params } from '@interfaces/api';
import { FusebitAxios, useAxios } from '@hooks/useAxios';

export const getMe = <T>(axiosInstance: FusebitAxios, params: Params, queryParams?: Params) => {
  return axiosInstance<T>(`/v1/account/${params.accountId}/me`, 'get', params, {}, queryParams);
};

export const useAccountGetMe = <T>(params: Params) => {
  const { axios } = useAxios();
  const { enabled, ...queryParams } = params;

  return useQuery(['accountGetMe'], () => axios<T>(`/v1/account/${queryParams.accountId}/me`, 'get', params), {
    enabled: !!enabled,
  });
};
