import axios from 'axios';
import { User } from '../interfaces/user';
import { addClientIdentity, createClient, removeClient } from './clients';
import { BACKEND_LIST_STORAGE_ID } from './constants';
import { generateKeyPair } from './crypto';
import { generateNonExpiringToken } from './jwt';
import { createIssuer, removeIssuer } from './issuer';
import { BackendClient } from '../interfaces/backendClient';
import { Storage } from '../interfaces/storage';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

const axiosNo404MiddlewareInstance = axios.create();

export async function createBackendClient(user: User): Promise<BackendClient> {
  const currentBackends = await getBackendClients(user);

  if (currentBackends.length >= 5) {
    throw new Error('You have reached the limit of 5 backend clients registered at Fusebit.');
  }

  const client = await createClient(user);
  const ketPair = await generateKeyPair();
  const issuer = await createIssuer(user, client, ketPair);
  await addClientIdentity(user, client.id, issuer);

  const nonExpiringToken = await generateNonExpiringToken(ketPair, issuer);
  const tokenSignature = nonExpiringToken.split('.')[2];

  const backendClient = {
    id: client.id,
    issuer: issuer.id,
    tokenSignature,
  };
  const backends = [...currentBackends, backendClient];
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
      headers: { Authorization: `Bearer ${token}` },
    });
    return clientsResponse.data.data;
  } catch (err) {
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
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}
