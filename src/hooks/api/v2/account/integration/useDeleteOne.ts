import { useMutation } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';
import { ACCOUNT_INTEGRATIONS_GET_ALL } from './useGetAll';
import useOptimisticDelete from '../../../../useOptimisticDelete';
import { useAuthContext } from '../../../../useAuthContext';

export const useAccountIntegrationDeleteIntegration = <T>() => {
  const { axios } = useAxios();
  const { userData } = useAuthContext();
  const optimisticDelete = useOptimisticDelete({
    queryKey: [
      ACCOUNT_INTEGRATIONS_GET_ALL,
      { accountId: userData.accountId, subscriptionId: userData.subscriptionId },
    ],
  });

  return useMutation((params: Params) => {
    const { accountId, subscriptionId, ...data } = params;
    return axios<T>(`/v2/account/${accountId}/subscription/${subscriptionId}/integration/${data.id}`, 'delete');
  }, optimisticDelete);
};
