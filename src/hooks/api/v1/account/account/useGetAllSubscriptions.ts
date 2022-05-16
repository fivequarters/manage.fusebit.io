import { useMutation } from 'react-query';
import { Params } from '@interfaces/api';
import { FusebitAxios, useAxios } from '@hooks/useAxios';

export const getAllSubscriptions = <T>(axiosInstance: FusebitAxios, params: Params, queryParams?: Params) => {
  return axiosInstance<T>(`/v1/account/${params.accountId}/subscription`, 'get', params, {}, queryParams);
};

export const useAccountGetAllSubscriptions = <T>() => {
  const { axios } = useAxios();

  return useMutation((params: Params) => getAllSubscriptions<T>(axios, params));
};
