import { useMutation, useQueryClient } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const useAccountUpdateOne = <T>() => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();

  return useMutation(
    (params: Params) => {
      const { accountId, data } = params;
      return axios<T>(`/v1/account/${accountId}`, 'patch', data);
    },
    {
      onMutate: () => () => {},
      onError: (_, __, rollback) => rollback?.(),
      onSuccess: () => queryClient.removeQueries('accountUpdateOne'),
    }
  );
};
