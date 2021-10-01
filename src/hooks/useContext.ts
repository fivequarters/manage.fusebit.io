import constate from 'constate';
import { useEffect, useState } from 'react';
import { User } from '../interfaces/user';
import { getAuthLink, LS_KEY, readLocalData } from '../utils/utils';

const { REACT_APP_AUTH0_DOMAIN, REACT_APP_LOGOUT_REDIRECT_URL } = process.env;

const _useContext = () => {
  const [userData, setUserData] = useState<User>({});

  useEffect(() => {
    const __userData = readLocalData();
    if (__userData.token) {
      setUserData(__userData);
      if (window.location.pathname === '/quickstart') {
        localStorage.setItem('integrationsContract', window.location.search);
      } else if (window.location.pathname === '/quickstart-connectors') {
        localStorage.setItem('connectorsContract', window.location.search);
      }
    } else if (window.location.href.indexOf('logged-out') < 0) {
      if (window.location.pathname === '/quickstart') {
        localStorage.setItem('integrationsContract', window.location.search);
      } else if (window.location.pathname === '/quickstart-connectors') {
        localStorage.setItem('connectorsContract', window.location.search);
      }
      window.location.href = getAuthLink();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const auth = (__userData: User) => {
    setUserData(__userData);
    localStorage.setItem(LS_KEY, JSON.stringify(__userData));
    localStorage.setItem('firstTimeVisitor', 'true');
  };

  const logout = () => {
    localStorage.setItem(LS_KEY, JSON.stringify({}));
    localStorage.removeItem('firstTimeVisitor');
    setUserData({ picture: userData.picture });
    window.location.href = `${REACT_APP_AUTH0_DOMAIN}/v2/logout?returnTo=${REACT_APP_LOGOUT_REDIRECT_URL}`;
  };

  return {
    userData,
    auth,
    logout,
  };
};

const [ContextProvider, useContext] = constate(_useContext);

export { ContextProvider, useContext };
