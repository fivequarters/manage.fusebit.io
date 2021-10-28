import { useMutation, useQueryClient } from 'react-query';
import { Params } from '@interfaces/api';
import { useAxios } from '@hooks/useAxios';
import { useAuthContext } from '@hooks/useAuthContext';
import useOptimisticDelete from '@hooks/useOptimisticDelete';
import { ACCOUNT_CONNECTORS_GET_ALL } from './useGetAll';
import { ACCOUNT_CONNECTORS_GET_ONE_CONFIG } from './useGetOneConfig';

export const useAccountConnectorDeleteConnector = <T>() => {
  const { axios } = useAxios();
  const { userData } = useAuthContext();
  const optimisticDelete = useOptimisticDelete({
    queryKey: [ACCOUNT_CONNECTORS_GET_ALL, { accountId: userData.accountId, subscriptionId: userData.subscriptionId }],
  });
  const queryClient = useQueryClient();

  return useMutation(
    (params: Params) => {
      const { accountId, subscriptionId, ...data } = params;
      return axios<T>(`/v2/account/${accountId}/subscription/${subscriptionId}/connector/${data.id}`, 'delete');
    },
    {
      ...optimisticDelete,
      onSuccess: (_, params) => {
        queryClient.removeQueries([ACCOUNT_CONNECTORS_GET_ONE_CONFIG, { id: params.id }]);
      },
    }
  );
};
