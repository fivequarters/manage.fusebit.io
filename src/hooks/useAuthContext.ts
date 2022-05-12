import { User } from '@interfaces/user';
import { getAnalyticsClient, trackAuthEvent } from '@utils/analytics';
import constate from 'constate';
import { useState } from 'react';
import { STATIC_TENANT_ID } from '@utils/constants';
import { Auth0Profile } from '@interfaces/auth0Profile';
import { Company } from '@interfaces/company';
import { createAxiosClient } from '@utils/utils';
import { Auth0Token, FusebitProfile, FusebitProfileEx } from '@interfaces/auth0Token';
import jwt_decode from 'jwt-decode';
import { useHistory } from 'react-router-dom';
import useFirstTimeVisitor from './useFirstTimeVisitor';

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
  setSignInLocalStorageItems(window.location.pathname, requestedSearch);
  const urlSearchParams = new URLSearchParams(window.location.search);
  const requestedPath = (urlSearchParams.get('requestedPath') || window.location.pathname).replace(/ /g, '+');
  const connection = urlSearchParams.get('fusebitConnection');

  // If this is an invitation URL, store the init token in local storage and redirect to authenticate
  // without provisioning a new Fusebit account. Init token will be redeemed in the auth callback.
  const init = (window.location.hash || '').match(/^#init=(.+)$/);
  const initToken = (init && init[1]) || undefined;
  if (initToken) {
    window.localStorage.setItem('fusebitInitToken', initToken);
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
    const { data: userInfo } = await auth0AxiosClient.get(`${REACT_APP_AUTH0_DOMAIN}/userinfo`);
    auth0Profile = userInfo;
    const fusebitAxiosClient = createAxiosClient(auth0Token);
    const { data: account } = await fusebitAxiosClient.get(`${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}`);
    company = account;

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

  const handleAuthError = (error: any) => {
    history.push(`/logged-out?error=${error}`);
  };

  const authUser = (token: string, profile?: FusebitProfile, onAuthFinished?: () => void) => {
    const decoded = jwt_decode<Auth0Token>(token);
    const fusebitProfile = profile || decoded['https://fusebit.io/profile'];
    const isSignUpEvent = decoded['https://fusebit.io/new-user'] === true;
    const initToken = window.localStorage.getItem('fusebitInitToken');

    if (initToken) {
      // This is completion of the invitation transaction. Call the provisioning function to
      // redeem the init token, then redirect back to the home page to re-authenticate and
      // get a new access token with an updated Fusebit profile.
      window.localStorage.removeItem('fusebitInitToken');
      redeemInitToken(token, fusebitProfile, initToken)
        .then(() => {
          history.push('/');
        })
        .catch((err) => {
          handleAuthError(err);
        });
      return;
    }

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

        setUserData({ token, ...fusebitProfile, ...auth0Profile, ...company, ...normalizedData });
        setAuthStatus(AuthStatus.AUTHENTICATED);

        const navigatePostAuth = () => {
          const urlSearchParams = new URLSearchParams(window.location.search);
          const requestedPath = (urlSearchParams.get('requestedPath') || '/').replace(/ /g, '+');
          const requestedSearch = localStorage.getItem('requestedSearch') || '';
          const requestedHash = localStorage.getItem('requestedHash') || '';

          setFirstTimeVisitor(true);
          localStorage.removeItem('requestedSearch');
          localStorage.removeItem('requestedHash');
          history.push(requestedPath + requestedSearch + requestedHash);
        };

        const user: User = { email: fusebitProfile?.email, ...auth0Profile, ...company };
        const issuedByAuth0 = decoded.iss.startsWith(process.env.REACT_APP_AUTH0_DOMAIN as string);
        getAnalyticsClient(user, issuedByAuth0);
        trackAuthEvent(user, fusebitProfile, isSignUpEvent, navigatePostAuth);
      })
      .catch((err) => {
        handleAuthError(err);
      })
      .finally(() => {
        onAuthFinished?.();
      });
  };

  return {
    checkAuthStatus,
    userData,
    setUserData,
    authStatus,
    setAuthStatus,
    getTenantId,
    getAuth0ProfileAndCompany,
    redeemInitToken,
    handleAuthError,
    authUser,
  };
};

const [ContextProvider, useAuthContext] = constate(_useAuthContext);

export { AuthStatus, ContextProvider, signOut, signIn, useAuthContext };
