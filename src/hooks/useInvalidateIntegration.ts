import { useQueryClient } from 'react-query';
import { ACCOUNT_INTEGRATIONS_GET_ONE } from './api/v2/account/integration/useGetOne';

export const useInvalidateIntegration = () => {
  const queryClient = useQueryClient();

  const invalidateIntegration = async () =>
    queryClient.invalidateQueries(ACCOUNT_INTEGRATIONS_GET_ONE, { active: true });

  return {
    invalidateIntegration,
  };
};
