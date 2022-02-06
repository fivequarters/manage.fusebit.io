import { User } from '@interfaces/user';
import { getAnalyticsClient } from '@utils/analytics';
import constate from 'constate';
import { useState } from 'react';
import { STATIC_TENANT_ID } from '@utils/constants';

const {
  REACT_APP_AUTH0_DOMAIN,
  REACT_APP_AUTH0_AUDIENCE,
  REACT_APP_AUTH0_CLIENT_ID,
  REACT_APP_FUSEBIT_DEPLOYMENT,
  REACT_APP_LOGOUT_REDIRECT_URL,
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
    silent && !connection ? '&prompt=none' : '',
  ].join('');

  window.location.href = authLink;
};

const _useAuthContext = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.UNKNOWN);
  const [userData, setUserData] = useState<User>({});

  const checkAuthStatus = async () => {
    const isUserDataDefined = userData && Object.entries(userData).length > 0;
    if (!isUserDataDefined) {
      const silent = true;
      return signIn(silent);
    }
    setAuthStatus(AuthStatus.AUTHENTICATED);
  };

  const getTenantId = () => userData.userId || STATIC_TENANT_ID;

  return {
    checkAuthStatus,
    userData,
    setUserData,
    authStatus,
    setAuthStatus,
    getTenantId,
  };
};

const [ContextProvider, useAuthContext] = constate(_useAuthContext);

export { AuthStatus, ContextProvider, signOut, signIn, useAuthContext };
