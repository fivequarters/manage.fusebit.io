import axios from 'axios';
import { User } from '../interfaces/user';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

const axiosNo404MiddlewareInstance = axios.create();

export function deleteClient(user: User, clientId: string) {
  const { accountId, token } = user;
  const clientPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/client/${clientId}`;
  return axiosNo404MiddlewareInstance.delete(clientPath, { headers: { authorization: `bearer ${token}` } });
}

export function patchClient(user: User, clientId: string, partialClient: any) {
  const { accountId, token } = user;
  const clientPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/client/${clientId}`;
  return axiosNo404MiddlewareInstance.patch(clientPath, partialClient, {
    headers: { authorization: `bearer ${token}` },
  });
}

export function createClient(user: User) {
  const { accountId, subscriptionId, token } = user;
  const clientPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/client`;
  const client = {
    displayName: 'My Backend',
    access: {
      allow: [
        {
          action: '*',
          resource: `/account/${accountId}/subscription/${subscriptionId}`,
        },
      ],
    },
  };
  return axiosNo404MiddlewareInstance.post(clientPath, client, { headers: { authorization: `bearer ${token}` } });
}
