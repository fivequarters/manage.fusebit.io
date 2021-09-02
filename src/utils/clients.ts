import axios from 'axios';
import { Issuer } from '../interfaces/issuer';
import { User } from '../interfaces/user';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

const axiosNo404MiddlewareInstance = axios.create();

export async function removeClient(user: User, clientId: string) {
  const { accountId, token } = user;
  const clientPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/client/${clientId}`;
  return axiosNo404MiddlewareInstance.delete(clientPath, {
    headers: { authorization: `bearer ${token}` },
    validateStatus: (status) => status === 204 || status === 404,
  });
}

export function getClient(user: User, clientId: string) {
  const { accountId, token } = user;
  const clientPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/client/${clientId}`;
  return axiosNo404MiddlewareInstance.get(clientPath, {
    headers: { authorization: `bearer ${token}` },
  });
}

export async function addClientIdentity(user: User, clientId: string, issuer: Issuer) {
  const { data: client } = await getClient(user, clientId);

  const { accountId, token } = user;
  const identities = client.identities || [];
  identities.push({
    issuerId: issuer.id,
    subject: client.id,
  });
  const partialClient = {
    identities,
  };
  const clientPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/client/${clientId}`;
  return axiosNo404MiddlewareInstance.patch(clientPath, partialClient, {
    headers: { authorization: `bearer ${token}` },
  });
}

export function createClient(user: User) {
  const { accountId, token } = user;
  const clientPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/client`;
  const client = {
    displayName: 'My Backend',
    access: {
      allow: [
        {
          action: '*',
          resource: `/account/${accountId}/`,
        },
      ],
    },
  };
  return axiosNo404MiddlewareInstance.post(clientPath, client, { headers: { authorization: `bearer ${token}` } });
}
