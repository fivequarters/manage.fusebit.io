import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import { Params } from '../../../../../../interfaces/api';
import { useAxios } from '../../../../../useAxios';
import { useContext } from '../../../../../useContext';
import useOptimisticDelete from '../../../../../useOptimisticDelete';
import { ACCOUNT_INTEGRATION_INSTANCE_GET_ALL } from './useGetAll';

export const useAccountIntegrationInstanceDeleteOne = <T>() => {
  const { axios } = useAxios();
  const { userData } = useContext();
  const { id: integrationId } = useParams<{ id: string }>();
  const optimisticDelete = useOptimisticDelete({
    queryKey: [
      ACCOUNT_INTEGRATION_INSTANCE_GET_ALL,
      { accountId: userData.accountId, subscriptionId: userData.subscriptionId, id: integrationId },
    ],
  });

  return useMutation((params: Params) => {
    return axios<T>(
      `/v2/account/${userData.accountId}/subscription/${userData.subscriptionId}/integration/${integrationId}/instance/${params.id}`,
      'delete'
    );
  }, optimisticDelete);
};
