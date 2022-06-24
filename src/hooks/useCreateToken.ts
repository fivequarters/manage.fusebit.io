import { Operation } from '@interfaces/operation';
import { useAuthContext } from './useAuthContext';
import { useAccountUserCreateToken } from './api/v1/account/user/useCreateToken';

export const useCreateToken = () => {
  const { userData } = useAuthContext();
  const createToken = useAccountUserCreateToken<Operation>();

  const _createToken = async (userId: string, protocol?: 'pki' | 'oauth') => {
    const response = await createToken.mutateAsync({
      data: {
        protocol: protocol || 'pki',
        profile: {
          id: 'default',
          subscription: userData.subscriptionId,
          oauth: {},
        },
      },
      userId,
      accountId: userData.accountId,
    });
    return response.data.toString();
  };

  return {
    _createToken,
  };
};
