import { Decoded } from '../interfaces/decoded';
import jwt_decode from 'jwt-decode';

const { REACT_APP_AUTH0_DOMAIN, REACT_APP_AUTH0_CLIENT_ID, REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

export const useGetAuthLink = () => {
  const getAuthLink = () => {
    const authLink = `${REACT_APP_AUTH0_DOMAIN}/authorize?response_type=token&client_id=${REACT_APP_AUTH0_CLIENT_ID}&audience=${REACT_APP_FUSEBIT_DEPLOYMENT}&redirect_uri=${window.location.origin}/callback&scope=openid profile email`;
    return authLink;
  };

  const isTokenExpired = (token: string) => {
    const TIME_T0_EXPIRE = 300000; // in miliseconds (5 mins currently)
    const decoded: Decoded = jwt_decode(token);
    const exp = decoded.exp;
    const expInmilliseconds = exp * 1000;
    const todayInMiliseconds = new Date().getTime();
    if (todayInMiliseconds - expInmilliseconds >= TIME_T0_EXPIRE) {
      window.location.href = getAuthLink(); //refreshing the token
    } else {
      return false;
    }
  };

  return {
    getAuthLink,
    isTokenExpired,
  };
};
