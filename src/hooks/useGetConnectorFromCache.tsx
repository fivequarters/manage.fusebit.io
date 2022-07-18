import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { Connector } from '@interfaces/connector';
import { useAuthContext } from './useAuthContext';
import { ApiResponse } from './useAxios';
import { ACCOUNT_CONNECTORS_GET_ONE } from './api/v2/account/connector/useGetOne';

export const useGetConnectorFromCache = () => {
  const { userData } = useAuthContext();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  return queryClient.getQueryData<ApiResponse<Connector>>([
    ACCOUNT_CONNECTORS_GET_ONE,
    { id, accountId: userData.accountId, subscriptionId: userData.subscriptionId },
  ]);
};
