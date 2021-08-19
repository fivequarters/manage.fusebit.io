import { useMutation } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const useAccountIntegrationUpdateIntegration = <T>() => {
  const { axios } = useAxios();

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
