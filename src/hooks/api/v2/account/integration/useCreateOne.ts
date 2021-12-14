import { useMutation, useQueryClient } from 'react-query';
import { Params } from '@interfaces/api';
import { getDefaultIntegrationConfig } from '@utils/localStorage';
import { useAuthContext } from '@hooks/useAuthContext';
import { useAxios } from '@hooks/useAxios';

export const useAccountIntegrationCreateIntegration = <T>() => {
  const { axios } = useAxios();
  const { getTenantId } = useAuthContext();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const defaultIntegrationConfig = getDefaultIntegrationConfig(tenantId);

  return useMutation(
    (params: Params) => {
      const { accountId, subscriptionId, ...data } = params;
      return axios<T>(`/v2/account/${accountId}/subscription/${subscriptionId}/integration/${data.id}`, 'post', data);
    },
    {
      onMutate: () => () => {},
      onError: (_, __, rollback) => rollback?.(),
      onSuccess: (_, { id }) => {
        localStorage.setItem(id, JSON.stringify(defaultIntegrationConfig));
        queryClient.removeQueries('accountIntegrationsGetAll');
      },
    }
  );
};
