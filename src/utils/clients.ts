import axios from 'axios';
import { Client } from '../interfaces/client';
import { Issuer } from '../interfaces/issuer';
import { User } from '../interfaces/user';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

const axiosNo404MiddlewareInstance = axios.create({
  headers: {
    'X-User-Agent': `fusebit-portal/${process.env.REACT_APP_VERSION} ${navigator.userAgent}`,
  },
});

export async function removeClient(user: User, clientId: string): Promise<void> {
  const { accountId, token } = user;
  const clientPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/client/${clientId}`;
  await axiosNo404MiddlewareInstance.delete<Client>(clientPath, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    validateStatus: (status) => status === 204 || status === 404,
  });
}

export async function getClient(user: User, clientId: string): Promise<Client> {
  const { accountId, token } = user;
  const clientPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/client/${clientId}`;
  const response = await axiosNo404MiddlewareInstance.get<Client>(clientPath, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function addClientIdentity(user: User, clientId: string, issuer: Issuer): Promise<Client> {
  const client = await getClient(user, clientId);

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
  const response = await axiosNo404MiddlewareInstance.patch<Client>(clientPath, partialClient, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function createClient(user: User): Promise<Client> {
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
  const response = await axiosNo404MiddlewareInstance.post<Client>(clientPath, client, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function patchClient(user: User, client: Partial<Client>): Promise<Client> {
  const { accountId, token } = user;
  const clientPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/client/${client.id}`;
  const response = await axiosNo404MiddlewareInstance.patch<Client>(clientPath, client, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
