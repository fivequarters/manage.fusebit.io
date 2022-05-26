import { useQuery, UseQueryOptions } from 'react-query';
import { useAuthContext } from '@hooks/useAuthContext';
import { useError } from '@hooks/useError';
import { Account, AccountListItem, AccountSubscriptions } from '@interfaces/account';
import { useAccountGetAllSubscriptions } from './useGetAllSubscriptions';
import { useAccountGetOne } from './useGetOne';
import { useAccountGetMe } from './useGetMe';

export const ACCOUNT_GET_ALL_ACCOUNTS = 'accountGetAllAccounts';

export const useAccountGetAllAccounts = (options?: UseQueryOptions<unknown, unknown, AccountListItem[]>) => {
  const { userData, getDecodedToken } = useAuthContext();
  const { createError } = useError();
  const subscriptions = useAccountGetAllSubscriptions<AccountSubscriptions>();
  const account = useAccountGetOne<Account>();
  const getMe = useAccountGetMe();

  const getAllAccounts = async () => {
    try {
      const { fusebitProfile } = getDecodedToken(userData.token || '');
      const fullAccounts: AccountListItem[] = [];
      if (fusebitProfile.accounts) {
        for (let i = 0; i < fusebitProfile?.accounts.length; i++) {
          const acc = fusebitProfile?.accounts[i];
          const subscriptionsData = await subscriptions.mutateAsync(acc);
          const accountData = await account.mutateAsync(acc);
          const me = await getMe.mutateAsync(acc);
          const isValid = me.success;

          if (isValid) {
            const fullAccount: AccountListItem = {
              ...acc,
              subscriptions: subscriptionsData.data.items,
              company: accountData.data.displayName,
              displayName: accountData.data.displayName,
            };
            fullAccounts.push(fullAccount);
          }
        }

        return fullAccounts;
      }
    } catch (error) {
      createError(error);
    }
  };

  return useQuery([ACCOUNT_GET_ALL_ACCOUNTS], getAllAccounts, {
    enabled: !!userData.token,
    ...options,
  });
};
