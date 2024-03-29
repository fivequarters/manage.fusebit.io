import { useMutation, useQueryClient } from 'react-query';
import { Params } from '@interfaces/api';
import { useAxios } from '@hooks/useAxios';
import { ACCOUNT_CONNECTORS_GET_ALL } from './useGetAll';

export const useAccountConnectorCreateConnector = <T>() => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();

  return useMutation(
    (params: Params) => {
      const { accountId, subscriptionId, ...data } = params;
      return axios<T>(`/v2/account/${accountId}/subscription/${subscriptionId}/connector/${data.id}`, 'post', data);
    },
    {
      onMutate: () => () => {},
      onError: (_, __, rollback) => rollback?.(),
      onSuccess: () => queryClient.invalidateQueries(ACCOUNT_CONNECTORS_GET_ALL),
    }
  );
};
