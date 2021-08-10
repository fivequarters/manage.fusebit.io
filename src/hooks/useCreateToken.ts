import { useContext } from './useContext';
import { useAccountUserCreateToken } from './api/v1/account/user/useCreateToken';
import { Operation } from '../interfaces/operation';
import { useLoader } from './useLoader';

export const useCreateToken = () => {
  const { userData } = useContext();
  const createToken = useAccountUserCreateToken<Operation>();
  const { waitForOperations } = useLoader();

  const _createToken = async (userId: string) => {
    const response = await createToken.mutateAsync({ userId, accountId: userData.accountId });
    await waitForOperations([response.data.operationId]);
    return response.data.toString();
  };

  return {
    _createToken,
  };
};
