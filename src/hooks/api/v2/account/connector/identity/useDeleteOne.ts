import { useMutation, useQueryClient } from 'react-query';
import { Params } from '../../../../../../interfaces/api';
import { useAxios } from '../../../../../useAxios';

export const useAccountConnectorIdentityDeleteOne = <T>() => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();

  return useMutation(
    (params: Params) => {
      const { accountId, subscriptionId, id, ...data } = params;
      return axios<T>(
        `/v2/account/${accountId}/subscription/${subscriptionId}/connector/${id}/identity/${data.id}`,
        'delete'
      );
    },
    {
      onMutate: (_: Params) => () => {},
      onError: (_, __, rollback) => rollback?.(),
      onSuccess: () => queryClient.removeQueries('accountConnectorIdentityGetAll'),
    }
  );
};
