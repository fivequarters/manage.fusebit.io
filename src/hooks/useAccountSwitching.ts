import { AccountSubscriptions } from '@interfaces/account';
import { Auth0Token, FusebitProfile, FusebitProfileEx } from '@interfaces/auth0Token';
import { AxiosInstance } from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { User } from '@interfaces/user';
import { Dispatch, SetStateAction } from 'react';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

interface Props {
  userData: User;
  setUserData: Dispatch<SetStateAction<User>>;
}

const useAccountSwitching = ({ userData, setUserData }: Props) => {
  const location = useLocation();
  const history = useHistory();
  const urlSearchParams = new URLSearchParams(window.location.search);
  const requestedPath = (urlSearchParams.get('requestedPath') || '/').replace(/ /g, '+');

  const getUrlAccount = () => {
    const [, , accountId, , subscriptionId] = requestedPath.split('/');

    return {
      accountId,
      subscriptionId,
    };
  };

  const getLastUsedAccountKey = (fusebitProfile: FusebitProfileEx) => {
    return `${fusebitProfile?.accountId}:${fusebitProfile?.subscriptionId}:${fusebitProfile?.userId}`;
  };

  const getLastUsedAccount = (fusebitProfile: FusebitProfileEx) => {
    const LAST_USED_ACCOUNT_KEY = getLastUsedAccountKey(fusebitProfile);
    const profile = localStorage.getItem(LAST_USED_ACCOUNT_KEY);
    if (profile) {
      const { accountId, subscriptionId, userId } = JSON.parse(profile || '');

      return {
        accountId,
        subscriptionId,
        userId,
      };
    }

    return {
      accountId: undefined,
      subscriptionId: undefined,
      userId: undefined,
    };
  };

  const setLastUsedAccount = (fusebitProfile: FusebitProfileEx, lastUsedAccount: FusebitProfile) => {
    const LAST_USED_ACCOUNT_KEY = getLastUsedAccountKey(fusebitProfile);
    localStorage.setItem(LAST_USED_ACCOUNT_KEY, JSON.stringify(lastUsedAccount));
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
      await fusebitAxiosClient.get(`${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${newFusebitProfile?.accountId}/me`);
      setLastUsedAccount(fusebitProfile, newFusebitProfile);

      fusebitProfile = {
        ...fusebitProfile,
        ...newFusebitProfile,
      };
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

    const getProfileWithSubscriptionName = async (profile: FusebitProfileEx) => {
      const subscriptions = await getSubscriptions(profile.accountId || '', axios);
      const activeSubscriptionData = subscriptions.find((sub) => sub.id === profile.subscriptionId);
      profile = {
        ...profile,
        subscriptionName: activeSubscriptionData?.displayName,
      };

      return profile;
    };

    const urlAccount = getUrlAccount();
    const lastUsedAccount = getLastUsedAccount(defaultProfile);
    const hasUrlAccount = urlAccount.accountId && urlAccount.subscriptionId;
    const hasLastUsedAccount = lastUsedAccount?.accountId && lastUsedAccount?.subscriptionId && lastUsedAccount?.userId;

    if (hasUrlAccount) {
      const userId = getUserIdFromAccount(urlAccount.accountId);
      fusebitProfile = await getFusebitProfile(fusebitProfile, { ...urlAccount, userId }, axios);
      fusebitProfile = await getProfileWithSubscriptionName(fusebitProfile);

      return fusebitProfile;
    }

    if (hasLastUsedAccount) {
      fusebitProfile = await getFusebitProfile(fusebitProfile, lastUsedAccount, axios);
      fusebitProfile = await getProfileWithSubscriptionName(fusebitProfile);

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
    const decoded = jwt_decode<Auth0Token>(userData?.token || '');
    const fusebitProfile = decoded['https://fusebit.io/profile'];
    setUserData({
      ...userData,
      ...newAccount,
    });
    setLastUsedAccount(fusebitProfile, newAccount);

    history.push(getNewLocationAccount(newAccount));
  };

  return {
    populateProfile,
    setLastUsedAccount,
    switchAccount,
  };
};

export default useAccountSwitching;
