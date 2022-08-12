import { User } from '@interfaces/user';
import { getAnalyticsClient, trackAuthEvent } from '@utils/analytics';
import constate from 'constate';
import { useState } from 'react';
import { INVITED_TO_FUSEBIT_KEY, STATIC_TENANT_ID } from '@utils/constants';
import { Auth0InviteProfile, Auth0Profile } from '@interfaces/auth0Profile';
import { Company } from '@interfaces/company';
import { createAxiosClient } from '@utils/utils';
import { Auth0InviteToken, Auth0Token, FusebitProfileEx } from '@interfaces/auth0Token';
import jwt_decode from 'jwt-decode';
import { useHistory } from 'react-router-dom';
import useFirstTimeVisitor from '@hooks/useFirstTimeVisitor';
import useAccountSwitching from './useAccountSwitching';

const {
  REACT_APP_AUTH0_DOMAIN,
  REACT_APP_AUTH0_AUDIENCE,
  REACT_APP_AUTH0_CLIENT_ID,
  REACT_APP_FUSEBIT_DEPLOYMENT,
  REACT_APP_LOGOUT_REDIRECT_URL,
  REACT_APP_FUSEBIT_USER_ID,
  REACT_APP_FUSEBIT_ACCOUNT_ID,
  REACT_APP_FUSEBIT_SUBSCRIPTION_ID,
} = process.env;

enum AuthStatus {
  CHECKING,
  AUTHENTICATED,
  UNKNOWN,
  UNAUTHENTICATED,
}

const signOut = () => {
  getAnalyticsClient().reset();
  window.location.href = `${REACT_APP_AUTH0_DOMAIN}/v2/logout?returnTo=${REACT_APP_LOGOUT_REDIRECT_URL}`;
};

const setSignInLocalStorageItems = (requestedPath: string, requestedSearch: string) => {
  // If we are not in the callback url and pathname matches signup, open the signup modal on auth0, otherwise open the login modal
  if (requestedPath.indexOf('callback') < 0) {
    if (window.location.pathname.indexOf('signup') > 0) {
      localStorage.setItem('screenHint', 'signup');
    } else {
      localStorage.setItem('screenHint', 'login');
    }
  }

  // Save the search params for the AuthCallbackPage navigatePostAuth
  if (requestedSearch.indexOf('requestedPath') < 0) {
    localStorage.setItem('requestedSearch', window.location.search);
    if (window.location.hash && window.location.hash !== '#') {
      localStorage.setItem('requestedHash', window.location.hash);
    }
  }
};

const signIn = (silent?: boolean): void => {
  const requestedSearch = window.location.search;
  const urlSearchParams = new URLSearchParams(requestedSearch);
  const requestedPath = (urlSearchParams.get('requestedPath') || window.location.pathname).replace(/ /g, '+');
  setSignInLocalStorageItems(requestedPath, requestedSearch);
  const connection = urlSearchParams.get('fusebitConnection');

  // If this is an invitation URL, store the init token in local storage and redirect to authenticate
  // without provisioning a new Fusebit account. Init token will be redeemed in the auth callback.
  const init = (window.location.hash || '').match(/^#init=(.+)$/);
  const initToken = (init && init[1]) || undefined;
  if (initToken) {
    localStorage.setItem('fusebitInitToken', initToken);
  }

  const authLink = [
    REACT_APP_AUTH0_DOMAIN,
    '/authorize?response_type=token',
    connection ? `&connection=${encodeURIComponent(connection)}` : '',
    `&client_id=${REACT_APP_AUTH0_CLIENT_ID}`,
    `&audience=${REACT_APP_AUTH0_AUDIENCE || REACT_APP_FUSEBIT_DEPLOYMENT}`,
    `&redirect_uri=${window.location.origin}/callback?silentAuth=${silent ? 'true' : 'false'}`,
    `%26requestedPath=${requestedPath === '/callback' ? `/` : encodeURIComponent(requestedPath)}`,
    '&scope=openid profile email',
    `&screen_hint=${localStorage.getItem('screenHint')}`,
    silent && !connection && !initToken ? '&prompt=none' : '',
    initToken ? '&noprovision' : '',
  ].join('');

  window.location.href = authLink;
};

const _useAuthContext = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.UNKNOWN);
  const [userData, setUserData] = useState<User>({});
  const { setFirstTimeVisitor } = useFirstTimeVisitor();
  const history = useHistory();
  const { populateProfile, switchAccount } = useAccountSwitching({ userData, setUserData });

  const checkAuthStatus = async () => {
    const isUserDataDefined = userData && Object.entries(userData).length > 0;
    if (!isUserDataDefined) {
      const silent = true;
      return signIn(silent);
    }
    setAuthStatus(AuthStatus.AUTHENTICATED);
  };

  const getTenantId = () => userData.userId || STATIC_TENANT_ID;

  const getAuth0ProfileAndCompany = async (auth0Token: string, accountId: string) => {
    let auth0Profile = {} as Auth0Profile;
    let company = {} as Company;
    const skipXUserAgent = true;
    const auth0AxiosClient = createAxiosClient(auth0Token, skipXUserAgent);
    const fusebitAxiosClient = createAxiosClient(auth0Token);
    try {
      const { data: userInfo } = await auth0AxiosClient.get(`${REACT_APP_AUTH0_DOMAIN}/userinfo`);
      auth0Profile = userInfo;
      const { data: account } = await fusebitAxiosClient.get(`${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}`);
      company = account;
    } catch {
      const decoded = jwt_decode<Auth0Token>(auth0Token);
      const fusebitProfile = decoded['https://fusebit.io/profile'];
      auth0Profile = {
        given_name: 'Name',
        family_name: 'LastName',
        sub: decoded.sub,
      };
      company = {
        displayName: fusebitProfile.email,
        id: fusebitProfile.accountId,
        primaryEmail: fusebitProfile.email,
      };
    }

    return {
      auth0Profile,
      company,
    };
  };

  const redeemInitToken = async (accessToken: string, fusebitProfileEx: FusebitProfileEx, initToken: string) => {
    const skipXUserAgent = true;
    const client = createAxiosClient(undefined, skipXUserAgent);
    const { data } = await client.post(`${fusebitProfileEx.fusebitProvisionUrl}/init`, {
      initToken,
      accessToken,
    });
    return data;
  };

  const getDecodedToken = (token: string) => {
    const decoded = jwt_decode<Auth0Token>(token);
    const fusebitProfile = decoded['https://fusebit.io/profile'];
    const isSignUpEvent = decoded['https://fusebit.io/new-user'] === true;
    const isSupportingTool = !!decoded['https://fusebit.io/permissions'];
    const issuedByAuth0 = decoded.iss.startsWith(process.env.REACT_APP_AUTH0_DOMAIN as string);
    return { fusebitProfile, isSignUpEvent, issuedByAuth0, isSupportingTool };
  };

  const handleAuthError = (error: any, invalidInviteToken?: boolean) => {
    history.push(`/logged-out?error=${error.message || error}&invalidInviteToken=${!!invalidInviteToken}`);
  };

  const authUser = async (token: string) => {
    try {
      const { fusebitProfile: profile, isSignUpEvent, issuedByAuth0, isSupportingTool } = getDecodedToken(token);
      const initToken = localStorage.getItem('fusebitInitToken');
      const fusebitAxiosClient = createAxiosClient(token);

      if (initToken) {
        // This is completion of the invitation transaction. Call the provisioning function to
        // redeem the init token, then redirect back to the home page to re-authenticate and
        // get a new access token with an updated Fusebit profile.
        localStorage.removeItem('fusebitInitToken');
        const decoded = jwt_decode<Auth0InviteToken>(initToken);
        const fusebitInitProfile = decoded.profile as Auth0InviteProfile;
        redeemInitToken(token, profile, initToken)
          .then(() => {
            localStorage.setItem(INVITED_TO_FUSEBIT_KEY, JSON.stringify(fusebitInitProfile));
            history.push('/');
          })
          .catch((err) => {
            const isUserAlreadyInvited = !!profile.accounts?.find(
              (acc) => acc.accountId === fusebitInitProfile.account
            );
            if (isUserAlreadyInvited) {
              history.push(
                `/account/${fusebitInitProfile.account}/subscription/${fusebitInitProfile.subscription}/integrations/overview`
              );
            } else {
              handleAuthError(err, true);
            }
          });
        return;
      }

      const fusebitProfile = await populateProfile(profile, isSupportingTool, fusebitAxiosClient);

      getAuth0ProfileAndCompany(token, fusebitProfile?.accountId || '')
        .then(({ auth0Profile, company }) => {
          const normalizedData = {
            firstName: auth0Profile?.given_name || '',
            lastName: auth0Profile?.family_name || '',
            company: company?.displayName || '',
          };

          // for local testing: https://docs.google.com/document/d/1dkI4UdRgaD840HWc-sGi6_qz4JY8AHts97MD-1O4SpY/edit#heading=h.gtoda0wgke4n
          if (REACT_APP_FUSEBIT_ACCOUNT_ID && REACT_APP_FUSEBIT_SUBSCRIPTION_ID && REACT_APP_FUSEBIT_USER_ID) {
            fusebitProfile.accountId = REACT_APP_FUSEBIT_ACCOUNT_ID;
            fusebitProfile.subscriptionId = REACT_APP_FUSEBIT_SUBSCRIPTION_ID;
            fusebitProfile.userId = REACT_APP_FUSEBIT_USER_ID;
          }

          setUserData({ token, ...company, ...normalizedData, ...auth0Profile, ...fusebitProfile });
          setAuthStatus(AuthStatus.AUTHENTICATED);

          const navigatePostAuth = () => {
            const requestedSearch = localStorage.getItem('requestedSearch') || '';
            const requestedHash = localStorage.getItem('requestedHash') || '';

            setFirstTimeVisitor(true);
            const urlSearchParams = new URLSearchParams(window.location.search);
            const requestedPath = (urlSearchParams.get('requestedPath') || '/').replace(/ /g, '+');
            localStorage.removeItem('requestedSearch');
            localStorage.removeItem('requestedHash');

            history.push(requestedPath + requestedSearch + requestedHash);
          };

          const user: User = { email: fusebitProfile?.email, ...auth0Profile, ...company };
          getAnalyticsClient(user, issuedByAuth0);
          trackAuthEvent(user, fusebitProfile, isSignUpEvent, navigatePostAuth);
        })
        .catch((err) => {
          handleAuthError(err);
        });
    } catch (err) {
      handleAuthError(err);
    }
  };

  return {
    checkAuthStatus,
    userData,
    setUserData,
    authStatus,
    setAuthStatus,
    getTenantId,
    getAuth0ProfileAndCompany,
    getDecodedToken,
    redeemInitToken,
    handleAuthError,
    authUser,
    switchAccount,
  };
};

const [ContextProvider, useAuthContext] = constate(_useAuthContext);

export { AuthStatus, ContextProvider, signOut, signIn, useAuthContext };
