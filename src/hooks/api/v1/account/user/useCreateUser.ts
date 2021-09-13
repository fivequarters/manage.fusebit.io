import { useMutation, useQueryClient } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';
import { ACCOUNT_USER_GET_ALL } from './useGetAll';

export const useAccountUserCreateUser = <T>() => {
  const { axios } = useAxios();
  const queryClient = useQueryClient()

  return useMutation(
    (params: Params) => {
      const { accountId, ...data } = params;
      return axios<T>(`/v1/account/${accountId}/user`, 'post', data);
    },
    {
      onMutate: (_: Params) => () => { },
      onError: (_, __, rollback) => rollback?.(),
      onSettled: () => { },
      onSuccess: () => {
        queryClient.invalidateQueries(ACCOUNT_USER_GET_ALL)
      },
    }
  );
};
