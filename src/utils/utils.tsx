import { Entity, Feed } from '../interfaces/feed';
import { FinalConnector } from '../interfaces/integrationDetailDevelop';
import { integrationsFeed, connectorsFeed } from '../static/feed';
import { Decoded } from '../interfaces/decoded';
import jwt_decode from 'jwt-decode';

const { REACT_APP_AUTH0_DOMAIN, REACT_APP_AUTH0_CLIENT_ID, REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;
export const LS_KEY = `T29M03eleloegehOxGtpEPel18JfM3djp5pUL4Jm`;

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

export const isTokenExpired = (token: string) => {
  const TIME_T0_EXPIRE = 300000; // in miliseconds (5 mins currently)
  const decoded: Decoded = jwt_decode(token);
  const exp = decoded.exp;
  const expInMilliseconds = exp * 1000;
  const todayInMiliseconds = new Date().getTime();
  return expInMilliseconds - todayInMiliseconds <= TIME_T0_EXPIRE; // if true it expired
};

export const handleTokenExpired = (expired: boolean) => {
  if (expired) {
    window.location.href = getAuthLink(); //refreshing the token
  }
};

export const readLocalData = () => JSON.parse(localStorage.getItem(LS_KEY) || '{}');
