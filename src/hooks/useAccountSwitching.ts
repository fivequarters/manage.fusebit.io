import { AccountSubscriptions } from '@interfaces/account';
import { FusebitProfile, FusebitProfileEx } from '@interfaces/auth0Token';
import { LAST_USED_ACCOUNT_KEY } from '@utils/constants';
import { AxiosInstance } from 'axios';
import { useHistory, useLocation } from 'react-router-dom';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

const useAccountSwitching = ({ userData, setUserData }: any) => {
  const location = useLocation();
  const history = useHistory();
  const urlSearchParams = new URLSearchParams(window.location.search);
  const requestedPath = (urlSearchParams.get('requestedPath') || '/').replace(/ /g, '+');

  const setLastUsedAccount = (accountId: string, subscriptionId: string, userId: string) => {
    localStorage.setItem(LAST_USED_ACCOUNT_KEY, `${accountId}:${subscriptionId}:${userId}`);
  };

  const getUrlAccount = () => {
    const [, , accountId, , subscriptionId] = requestedPath.split('/');

    return {
      accountId,
      subscriptionId,
    };
  };

  const getLastUsedAccount = () => {
    const [accountId, subscriptionId, userId] = localStorage.getItem(LAST_USED_ACCOUNT_KEY)?.split(':') || [];

    return {
      accountId,
      subscriptionId,
      userId,
    };
  };

  const getSubscriptions = async (accountId: string, fusebitAxiosClient: AxiosInstance) => {
    const subscriptions = await fusebitAxiosClient.get<AccountSubscriptions>(
      `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/subscription`
    );
    return subscriptions.data.items;
  };

  const getDefaultSubscriptionData = async (accountId: string, fusebitAxiosClient: AxiosInstance) => {
    const subscriptions = await getSubscriptions(accountId, fusebitAxiosClient);
    const defaultSubscription = subscriptions[0];
    return { subscriptionId: defaultSubscription.id, subscriptionName: defaultSubscription.displayName };
  };

  const getFusebitProfileWithDefaultSubscription = async (
    fusebitProfile: FusebitProfileEx,
    fusebitAxiosClient: AxiosInstance
  ) => {
    const defaultSubscription = await getDefaultSubscriptionData(fusebitProfile.accountId || '', fusebitAxiosClient);
    fusebitProfile = {
      ...fusebitProfile,
      ...defaultSubscription,
    };
    return fusebitProfile;
  };

  const getFusebitProfile = async (
    fusebitProfile: FusebitProfileEx,
    newFusebitProfile: FusebitProfile,
    fusebitAxiosClient: AxiosInstance
  ) => {
    try {
      // validate accountId
      await fusebitAxiosClient.get(`${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${newFusebitProfile.accountId}/me`);

      fusebitProfile = {
        ...fusebitProfile,
        ...newFusebitProfile,
      };
      setLastUsedAccount(
        fusebitProfile.accountId || '',
        fusebitProfile.subscriptionId || '',
        fusebitProfile.userId || ''
      );

      return fusebitProfile;
    } catch (e) {
      fusebitProfile = await getFusebitProfileWithDefaultSubscription(fusebitProfile, fusebitAxiosClient);
      return fusebitProfile;
    }
  };

  const populateProfile = async (defaultProfile: FusebitProfileEx, isSupportingTool: boolean, axios: AxiosInstance) => {
    let fusebitProfile = defaultProfile;

    const getUserIdFromAccount = (accountId: string) =>
      fusebitProfile.accounts?.find((acc) => acc.accountId === accountId)?.userId;

    if (isSupportingTool) {
      return fusebitProfile;
    }

    const urlAccount = getUrlAccount();
    const lastUsedAccount = getLastUsedAccount();
    const hasUrlAccount = urlAccount.accountId && urlAccount.subscriptionId;
    const hasLastUsedAccount = lastUsedAccount.accountId && lastUsedAccount.subscriptionId && lastUsedAccount.userId;

    if (hasUrlAccount) {
      const userId = getUserIdFromAccount(urlAccount.accountId);
      fusebitProfile = await getFusebitProfile(fusebitProfile, { ...urlAccount, userId }, axios);

      return fusebitProfile;
    }

    if (hasLastUsedAccount) {
      fusebitProfile = await getFusebitProfile(fusebitProfile, lastUsedAccount, axios);
      const subscriptions = await getSubscriptions(fusebitProfile.accountId || '', axios);
      const activeSubscriptionData = subscriptions.find((sub) => sub.id === fusebitProfile.subscriptionId);
      fusebitProfile = {
        ...fusebitProfile,
        subscriptionName: activeSubscriptionData?.displayName,
      };

      return fusebitProfile;
    }

    return await getFusebitProfileWithDefaultSubscription(fusebitProfile, axios);
  };

  const getNewLocationAccount = (newAccount: any) => {
    const { pathname } = location;
    return pathname
      .replace(userData?.accountId || '', newAccount.accountId || '')
      .replace(userData.subscriptionId || '', newAccount.subscriptionId || '');
  };

  const switchAccount = (newAccount: any) => {
    setUserData({
      ...userData,
      ...newAccount,
    });

    setLastUsedAccount(newAccount.accountId, newAccount.subscriptionId, newAccount.userId);
    history.push(getNewLocationAccount(newAccount));
  };

  return {
    populateProfile,
    setLastUsedAccount,
    switchAccount,
  };
};

export default useAccountSwitching;
