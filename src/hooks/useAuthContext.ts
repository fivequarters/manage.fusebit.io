import constate from 'constate';
import { useState } from 'react';
import { User } from '../interfaces/user';

const {
  REACT_APP_AUTH0_DOMAIN,
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

const silentAuthInProgress = (): boolean => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams.get('silentAuth') === 'true';
};

const signOut = () => {
  analytics.reset();
  window.location.href = `${REACT_APP_AUTH0_DOMAIN}/v2/logout?returnTo=${REACT_APP_LOGOUT_REDIRECT_URL}`;
};

const signIn = (silent?: boolean): void => {
  const requestedPath = window.location.pathname;
  const authLink = [
    REACT_APP_AUTH0_DOMAIN,
    '/authorize?response_type=token',
    `&client_id=${REACT_APP_AUTH0_CLIENT_ID}`,
    `&audience=${REACT_APP_FUSEBIT_DEPLOYMENT}`,
    `&redirect_uri=${window.location.origin}/callback?silentAuth=${silent ? 'true' : 'false'}`,
    `%26requestedPath=${requestedPath === '/callback' ? '/' : requestedPath}`,
    '&scope=openid profile email',
    silent ? '&prompt=none' : '',
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

  return {
    checkAuthStatus,
    userData,
    setUserData,
    authStatus,
    setAuthStatus,
  };
};

const [ContextProvider, useAuthContext] = constate(_useAuthContext);

export { AuthStatus, ContextProvider, signOut, signIn, silentAuthInProgress, useAuthContext };
