import { useMutation, useQueryClient } from 'react-query';
import { Params } from '@interfaces/api';
import { useAxios } from '@hooks/useAxios';

export const useAccountUserUpdateOne = <T>() => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();

  return useMutation(
    (params: Params) => {
      const { accountId, userId, data } = params;
      return axios<T>(`/v1/account/${accountId}/user/${userId}`, 'patch', data);
    },
    {
      onMutate: () => () => {},
      onError: (_, __, rollback) => rollback?.(),
      onSuccess: () => queryClient.removeQueries('accountUserUpdateOne'),
    }
  );
};
