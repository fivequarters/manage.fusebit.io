import { useMutation, useQueryClient } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { DEFAULT_INTEGRATION_CONFIG } from '../../../../../utils/localStorage';
import { useAxios } from '../../../../useAxios';

export const useAccountIntegrationCreateIntegration = <T>() => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();

  return useMutation(
    (params: Params) => {
      const { accountId, subscriptionId, ...data } = params;
      return axios<T>(`/v2/account/${accountId}/subscription/${subscriptionId}/integration/${data.id}`, 'post', data);
    },
    {
      onMutate: () => () => {},
      onError: (_, __, rollback) => rollback?.(),
      onSuccess: (_, { id }) => {
        localStorage.setItem(id, JSON.stringify(DEFAULT_INTEGRATION_CONFIG));

        queryClient.removeQueries('accountIntegrationsGetAll');
      },
    }
  );
};
