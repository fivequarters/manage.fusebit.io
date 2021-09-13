import { useMutation } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';
import { ACCOUNT_INTEGRATIONS_GET_ALL } from './useGetAll';
import useOptimisticDelete from '../../../../useOptimisticDelete'

export const useAccountIntegrationDeleteIntegration = <T>() => {
  const { axios } = useAxios();
  const optimisticDelete = useOptimisticDelete({ queryKey: ACCOUNT_INTEGRATIONS_GET_ALL })

  return useMutation(
    (params: Params) => {
      const { accountId, subscriptionId, ...data } = params;
      return axios<T>(`/v2/account/${accountId}/subscription/${subscriptionId}/integration/${data.id}`, 'delete');
    },
    optimisticDelete
  );
};
