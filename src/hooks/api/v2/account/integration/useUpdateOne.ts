import { useMutation, useQueryClient } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const useAccountIntegrationUpdateIntegration = <T>() => {
  const { axios } = useAxios();
  // const queryClient = useQueryClient();

  return useMutation(
    (params: Params) => {
      const { accountId, subscriptionId, integrationId, data } = params;
      return axios<T>(
        `/v2/account/${accountId}/subscription/${subscriptionId}/integration/${integrationId}`,
        'put',
        data
      );
    },
    {
      onMutate: (_: Params) => () => {},
      onError: (_, __, rollback) => rollback?.(),
    }
  );
};
