import { useMutation, useQueryClient } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { STATIC_TENANT_ID } from '../../../../../utils/constants';
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
      onMutate: (_: Params) => () => {},
      onError: (_, __, rollback) => rollback?.(),
      onSuccess: (_, { id }) => {
        localStorage.setItem(
          id,
          JSON.stringify({
            runner: {
              method: 'post',
              url: `/api/tenant/${STATIC_TENANT_ID}/test`,
              payload: '',
            },
          })
        );

        queryClient.removeQueries('accountIntegrationsGetAll');
      },
    }
  );
};
