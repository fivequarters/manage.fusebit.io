import { Entity, Feed } from '../interfaces/feed';
import { FinalConnector } from '../interfaces/integrationDetailDevelop';
import { integrationsFeed, connectorsFeed } from '../static/feed';
import { Decoded } from '../interfaces/decoded';
import jwt_decode from 'jwt-decode';
import { InstallInstance } from '../interfaces/install';
import { default as _startCase } from 'lodash.startcase';

const { REACT_APP_AUTH0_DOMAIN, REACT_APP_AUTH0_CLIENT_ID, REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;
export const LS_KEY = `T29M03eleloegehOxGtpEPel18JfM3djp5pUL4Jm`;

export const readLocalData = () => JSON.parse(localStorage.getItem(LS_KEY) || '{}');

export const findMatchingConnectorFeed = async (connector: Entity | FinalConnector) => {
  return new Promise<Feed>((accept, reject) => {
    if (connector.tags) {
      const feedtype = connector.tags['fusebit.feedType'];
      const feedId = connector.tags['fusebit.feedId'];
      if (feedtype === 'integration') {
        integrationsFeed().then((feed) => {
          feed.forEach((item) => {
            if (item.id === feedId) {
              return accept(item);
            }
          });
          return reject({});
        });
      } else {
        connectorsFeed().then((feed) => {
          feed.forEach((item) => {
            if (item.id === feedId) {
              return accept(item);
            }
          });
          return reject({});
        });
      }
    } else {
      return reject({});
    }
  });
};

export const getAuthLink = () => {
  const authLink = `${REACT_APP_AUTH0_DOMAIN}/authorize?response_type=token&client_id=${REACT_APP_AUTH0_CLIENT_ID}&audience=${REACT_APP_FUSEBIT_DEPLOYMENT}&redirect_uri=${window.location.origin}/callback&scope=openid profile email`;
  return authLink;
};

export const isTokenExpired = () => {
  const __userData = readLocalData();
  const token = __userData.token;
  const TIME_T0_EXPIRE = 300000; // in miliseconds (5 mins currently)
  const decoded: Decoded = jwt_decode(token);
  const exp = decoded.exp;
  const expInMilliseconds = exp * 1000;
  const todayInMiliseconds = new Date().getTime();
  return expInMilliseconds - todayInMiliseconds <= TIME_T0_EXPIRE; // if true it expired
};

export const validateToken = ({ onValid }: { onValid?: () => void } = {}) => {
  const expired = isTokenExpired();
  if (expired) {
    window.location.href = getAuthLink(); //refreshing the token
  } else {
    analytics.ready(() => {
      const user = readLocalData();
      if (!user || user === {}) return;
      analytics.identify(user.id, {
        ...user,
      } as Object);
    });
    onValid?.();
  }
};

export const startCase = (str: string) => {
  return _startCase(str.toLowerCase());
};

export const initIntercom = () => {
  window.Intercom('boot', {
    app_id: 'v9ncq3ml',
  });
};

export const updateIntercom = () => {
  window.Intercom('update');
};

export const getConnectorsFromInstall = (install: InstallInstance) =>
  Object.keys(install.data).map((key) => install?.data[key]?.parentEntityId);
