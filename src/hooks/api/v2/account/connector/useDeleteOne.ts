import { useMutation } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';
import useOptimisticDelete from '../../../../useOptimisticDelete';
import { ACCOUNT_CONNECTORS_GET_ALL } from './useGetAll';

export const useAccountConnectorDeleteConnector = <T>() => {
  const { axios } = useAxios();
  const optimisticDelete = useOptimisticDelete({ queryKey: ACCOUNT_CONNECTORS_GET_ALL });

  return useMutation((params: Params) => {
    const { accountId, subscriptionId, ...data } = params;
    return axios<T>(`/v2/account/${accountId}/subscription/${subscriptionId}/connector/${data.id}`, 'delete');
  }, optimisticDelete);
};
