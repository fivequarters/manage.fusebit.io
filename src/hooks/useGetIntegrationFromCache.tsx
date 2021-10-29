import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { Integration } from '@interfaces/integration';
import { ACCOUNT_INTEGRATIONS_GET_ONE } from './api/v2/account/integration/useGetOne';
import { useAuthContext } from './useAuthContext';
import { ApiResponse } from './useAxios';

export const useGetIntegrationFromCache = () => {
  const { userData } = useAuthContext();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  return queryClient.getQueryData<ApiResponse<Integration>>([
    ACCOUNT_INTEGRATIONS_GET_ONE,
    { id, accountId: userData.accountId, subscriptionId: userData.subscriptionId },
  ]);
};
