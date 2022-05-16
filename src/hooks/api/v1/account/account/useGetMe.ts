import { useMutation } from 'react-query';
import { Params } from '@interfaces/api';
import { FusebitAxios, useAxios } from '@hooks/useAxios';

export const getMe = <T>(axiosInstance: FusebitAxios, params: Params, queryParams?: Params) => {
  return axiosInstance<T>(`/v1/account/${params.accountId}/me`, 'get', params, {}, queryParams);
};

export const useAccountGetMe = <T>() => {
  const { axios } = useAxios();

  return useMutation(
    (params: Params) => {
      return getMe<T>(axios, params);
    },
    {
      onMutate: () => () => {},
      onError: (_, __, rollback) => rollback?.(),
      onSettled: () => {},
    }
  );
};
