import { useMutation, useQueryClient } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';
import { ACCOUNT_INTEGRATIONS_GET_ALL } from './useGetAll';

export const useAccountIntegrationDeleteIntegration = <T>() => {
  const { axios } = useAxios();
  const queryClient = useQueryClient()

  return useMutation(
    (params: Params) => {
      const { accountId, subscriptionId, ...data } = params;
      return axios<T>(`/v2/account/${accountId}/subscription/${subscriptionId}/integration/${data.id}`, 'delete');
    },
    {
      onMutate: async ({ id }: Params) => {
        await queryClient.cancelQueries(ACCOUNT_INTEGRATIONS_GET_ALL)

        const previous = queryClient.getQueryData<any>(ACCOUNT_INTEGRATIONS_GET_ALL)

        const newItems = [...(previous?.data?.items || [])]

        const index = newItems.findIndex(item => item.id === id)

        newItems.splice(index, 1)

        queryClient.setQueryData(ACCOUNT_INTEGRATIONS_GET_ALL, (old: any) => (({
          ...old, data: {
            items: newItems,
            total: previous?.data?.total - 1
          }
        })))

        return () => {
          queryClient.setQueryData(ACCOUNT_INTEGRATIONS_GET_ALL, previous)
        }
      },
      onError: (_, __, rollback) => rollback?.(),
      onSettled: () => {
        queryClient.invalidateQueries(ACCOUNT_INTEGRATIONS_GET_ALL)
      }
    }
  );
};
