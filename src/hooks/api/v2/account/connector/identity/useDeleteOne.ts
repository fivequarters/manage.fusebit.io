import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import { Params } from '@interfaces/api';
import { useAxios } from '@hooks/useAxios';
import { useAuthContext } from '@hooks/useAuthContext';
import useOptimisticDelete from '@hooks/useOptimisticDelete';
import { ACCOUNT_CONNECTOR_IDENTITY_GET_ALL } from './useGetAll';

export const useAccountConnectorIdentityDeleteOne = <T>() => {
  const { axios } = useAxios();
  const { userData } = useAuthContext();
  const { id: connectorId } = useParams<{ id: string }>();

  const optimisticDelete = useOptimisticDelete({
    queryKey: [
      ACCOUNT_CONNECTOR_IDENTITY_GET_ALL,
      { id: connectorId, accountId: userData.accountId, subscriptionId: userData.subscriptionId },
    ],
  });

  return useMutation((params: Params) => {
    return axios<T>(
      `/v2/account/${userData.accountId}/subscription/${userData.subscriptionId}/connector/${connectorId}/identity/${params.id}`,
      'delete'
    );
  }, optimisticDelete);
};
