import { useContext } from './useContext';
import { useAccountUserCreateToken } from './api/v1/account/user/useCreateToken';
import { Operation } from '../interfaces/operation';

export const useCreateToken = () => {
  const { userData } = useContext();
  const createToken = useAccountUserCreateToken<Operation>();

  const _createToken = async (userId: string) => {
    const response = await createToken.mutateAsync({ userId, accountId: userData.accountId });
    return response.data.toString();
  };

  return {
    _createToken,
  };
};
