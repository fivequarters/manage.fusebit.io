import { useAuthContext } from './useAuthContext';
import { useAccountUserCreateToken } from './api/v1/account/user/useCreateToken';
import { Operation } from '../interfaces/operation';

export const useCreateToken = () => {
  const { userData } = useAuthContext();
  const createToken = useAccountUserCreateToken<Operation>();

  const _createToken = async (userId: string) => {
    const response = await createToken.mutateAsync({
      data: { protocol: 'pki', profile: { id: 'default', subscription: userData.subscriptionId } },
      userId,
      accountId: userData.accountId,
    });
    return response.data.toString();
  };

  return {
    _createToken,
  };
};
