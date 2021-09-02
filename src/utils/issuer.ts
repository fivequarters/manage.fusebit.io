import axios from 'axios';
import { User } from '../interfaces/user';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

const axiosNo404MiddlewareInstance = axios.create();

export function removeIssuer(user: User, issuerId: string) {
  const { accountId, token } = user;
  const issuerPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/issuer/${issuerId}`;
  return axiosNo404MiddlewareInstance.delete(issuerPath, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
