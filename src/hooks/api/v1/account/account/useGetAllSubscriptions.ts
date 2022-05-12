import { useQuery } from 'react-query';
import { Params } from '@interfaces/api';
import { FusebitAxios, useAxios } from '@hooks/useAxios';

export const getAllSubscriptions = <T>(axiosInstance: FusebitAxios, params: Params, queryParams?: Params) => {
  return axiosInstance<T>(`/v1/account/${params.accountId}/subscription`, 'get', params, {}, queryParams);
};

export const useAccountGetAllSubscriptions = <T>(params: Params) => {
  const { axios } = useAxios();
  const { enabled, ...queryParams } = params;

  return useQuery(
    ['accountUserGetAllSubscriptions'],
    () => axios<T>(`/v1/account/${queryParams.accountId}/subscription`, 'get', params),
    {
      enabled: !!enabled,
    }
  );
};
