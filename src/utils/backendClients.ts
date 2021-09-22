import axios from 'axios';
import { User } from '../interfaces/user';
import { addClientIdentity, createClient, patchClient, removeClient } from './clients';
import { BACKEND_LIST_STORAGE_ID } from './constants';
import { generateKeyPair } from './crypto';
import { generateNonExpiringToken } from './jwt';
import { createIssuer, removeIssuer } from './issuer';
import { BackendClient } from '../interfaces/backendClient';
import { Storage } from '../interfaces/storage';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

const axiosNo404MiddlewareInstance = axios.create();
const UserAgent = `fusebit-portal/${process.env.REACT_APP_VERSION} ${navigator.userAgent}`;

export async function createBackendClient(user: User): Promise<BackendClient> {
  const backendClients = await getBackendClients(user);

  if (backendClients.length >= 5) {
    throw new Error('You have reached the limit of 5 backend clients registered at Fusebit.');
  }

  const client = await createClient(user);
  const ketPair = await generateKeyPair();
  const issuer = await createIssuer(user, client, ketPair);
  await addClientIdentity(user, client.id, issuer);

  const nonExpiringToken = await generateNonExpiringToken(ketPair, client, issuer);
  const tokenSignature = nonExpiringToken.split('.')[2];

  const backendClient = {
    id: client.id,
    name: client.displayName,
    issuer: issuer.id,
    tokenSignature,
  };

  const backends = [...backendClients, backendClient];
  await putBackendClients(user, backends);

  return {
    ...backendClient,
    token: nonExpiringToken,
  };
}

export async function removedBackendClient(user: User, clientId: string): Promise<void> {
  const clients = await getBackendClients(user);
  const filteredClients = clients.filter((c) => c.id !== clientId);

  await removeIssuer(user, clientId);
  await removeClient(user, clientId);
  await putBackendClients(user, filteredClients);
}

export async function getBackendClients(user: User): Promise<BackendClient[]> {
  try {
    const { accountId, subscriptionId, token } = user;
    const clientsPaths = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/subscription/${subscriptionId}/storage/${BACKEND_LIST_STORAGE_ID}`;
    const clientsResponse = await axiosNo404MiddlewareInstance.get<Storage<BackendClient>>(clientsPaths, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': UserAgent,
      },
    });
    return clientsResponse.data.data;
  } catch (err: any) {
    if (err?.response?.status === 404) {
      return [];
    }
    throw err;
  }
}

async function putBackendClients(user: User, backendClients: BackendClient[]): Promise<Storage<BackendClient>> {
  const { accountId, subscriptionId, token } = user;
  const clientsPaths = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/subscription/${subscriptionId}/storage/${BACKEND_LIST_STORAGE_ID}`;
  const response = await axiosNo404MiddlewareInstance.put<Storage<BackendClient>>(
    clientsPaths,
    { data: backendClients },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': UserAgent,
      },
    }
  );
  return response.data;
}

export async function patchBackendClients(
  id: string,
  user: User,
  backendClient: Partial<BackendClient>
): Promise<Storage<BackendClient>> {
  const backendClients: any[] = await getBackendClients(user);
  const index = backendClients.findIndex((client) => client.id === id);
  backendClients[index] = {
    ...backendClients[index],
    ...backendClient,
  };
  const { accountId, subscriptionId, token } = user;
  const clientsPaths = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/subscription/${subscriptionId}/storage/${BACKEND_LIST_STORAGE_ID}`;
  await patchClient(user, { id: id, displayName: backendClient.name });
  const response = await axiosNo404MiddlewareInstance.put<Storage<BackendClient>>(
    clientsPaths,
    { data: backendClients },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': UserAgent,
      },
    }
  );
  return response.data;
}
