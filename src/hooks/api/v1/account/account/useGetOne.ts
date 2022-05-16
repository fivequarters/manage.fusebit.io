import { useMutation } from 'react-query';
import { Params } from '@interfaces/api';
import { FusebitAxios, useAxios } from '@hooks/useAxios';

export const getOne = <T>(axiosInstance: FusebitAxios, params: Params, queryParams?: Params) => {
  return axiosInstance<T>(`/v1/account/${params.accountId}`, 'get', params, {}, queryParams);
};

export const useAccountGetOne = <T>() => {
  const { axios } = useAxios();

  return useMutation((params: Params) => getOne<T>(axios, params), {
    onMutate: () => () => {},
    onError: (_, __, rollback) => rollback?.(),
    onSettled: () => {},
  });
};
