import { Client } from '../interfaces/client';
import { Issuer } from '../interfaces/issuer';
import { User } from '../interfaces/user';
import { createAxiosClient } from './utils';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

export async function removeClient(user: User, clientId: string): Promise<void> {
  const { accountId, token } = user;
  const axiosClient = createAxiosClient(token);
  const clientPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/client/${clientId}`;
  await axiosClient.delete<Client>(clientPath, {
    validateStatus: (status) => status === 204 || status === 404,
  });
}

export async function getClient(user: User, clientId: string): Promise<Client> {
  const { accountId, token } = user;
  const axiosClient = createAxiosClient(token);
  const clientPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/client/${clientId}`;
  const response = await axiosClient.get<Client>(clientPath);
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
  const axiosClient = createAxiosClient(token);
  const clientPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/client/${clientId}`;
  const response = await axiosClient.patch<Client>(clientPath, partialClient);
  return response.data;
}

export async function createClient(user: User): Promise<Client> {
  const { accountId, token } = user;
  const clientPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/client`;
  const axiosClient = createAxiosClient(token);
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
  const response = await axiosClient.post<Client>(clientPath, client);
  return response.data;
}

export async function patchClient(user: User, client: Partial<Client>): Promise<Client> {
  const { accountId, token } = user;
  const clientPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/client/${client.id}`;
  const axiosClient = createAxiosClient(token);
  const response = await axiosClient.patch<Client>(clientPath, client);
  return response.data;
}
