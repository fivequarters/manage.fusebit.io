import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import { Params } from '../../../../../../interfaces/api';
import { useAxios } from '../../../../../useAxios';
import { useContext } from '../../../../../useContext';
import useOptimisticDelete from '../../../../../useOptimisticDelete';
import { ACCOUNT_INTEGRATION_INSTALL_GET_ALL } from './useGetAll';

export const useAccountIntegrationInstallDeleteOne = <T>() => {
  const { axios } = useAxios();
  const { userData } = useContext();
  const { id: integrationId } = useParams<{ id: string }>();
  const optimisticDelete = useOptimisticDelete({
    queryKey: [
      ACCOUNT_INTEGRATION_INSTALL_GET_ALL,
      { accountId: userData.accountId, subscriptionId: userData.subscriptionId, id: integrationId },
    ],
  });

  return useMutation((params: Params) => {
    return axios<T>(
      `/v2/account/${userData.accountId}/subscription/${userData.subscriptionId}/integration/${integrationId}/install/${params.id}`,
      'delete'
    );
  }, optimisticDelete);
};
