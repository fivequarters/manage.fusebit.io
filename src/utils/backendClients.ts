import axios from 'axios';
import { User } from '../interfaces/user';
import { addClientIdentity, createClient, removeClient } from './clients';
import { BACKEND_LIST_STORAGE_ID } from './constants';
import { generateKeyPair } from './crypto';
import { generateNonExpiringToken } from './jwt';
import { createIssuer, removeIssuer } from './issuer';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

const axiosNo404MiddlewareInstance = axios.create();

export async function createBackendClient(user: User) {
  const currentBackendList = await getBackendClients(user);

  if (currentBackendList.length >= 5) {
    throw new Error('You have reached the limit of 5 backend clients registered at Fusebit.');
  }

  const { data: client } = await createClient(user);
  const keyPairToken1 = await generateKeyPair();
  const { data: issuer } = await createIssuer(user, client, keyPairToken1);
  await addClientIdentity(user, client.id, issuer);

  const clientDetails = {
    id: client.id,
    issuer: issuer.id,
  };
  const currentBackends = await getBackendClients(user);
  const backends = [...currentBackends, clientDetails];

  await putBackendClients(user, backends);
  return generateNonExpiringToken(keyPairToken1, issuer, client.id);
}

export async function removedBackendClient(user: User, clientId: string) {
  const clients = await getBackendClients(user);
  const clientToBeRevoked = clients.find((c: any) => c.id === clientId);
  const filteredClients = clients.filter((c: any) => c.id !== clientId);

  if (clientToBeRevoked) {
    await removeIssuer(user, clientToBeRevoked.issuer);
  }
  await removeClient(user, clientId);
  await putBackendClients(user, filteredClients);
}

export async function getBackendClients(user: User) {
  try {
    const { accountId, subscriptionId, token } = user;
    const clientsPaths = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/subscription/${subscriptionId}/storage/${BACKEND_LIST_STORAGE_ID}`;
    const clientsResponse = await axiosNo404MiddlewareInstance.get(clientsPaths, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return clientsResponse.data.data;
  } catch (err) {
    if (err.message.includes('404')) {
      return [];
    }
    throw err;
  }
}

function putBackendClients(user: User, backendClients: any[]) {
  const { accountId, subscriptionId, token } = user;
  const clientsPaths = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/subscription/${subscriptionId}/storage/${BACKEND_LIST_STORAGE_ID}`;
  return axiosNo404MiddlewareInstance.put(
    clientsPaths,
    { data: backendClients },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}
