import axios from 'axios';
import { User } from '../interfaces/user';
import { addClientIdentity, deleteClient } from './clients';
import { BACKEND_LIST_STORAGE_ID } from './constants';
import { generateKeyPair } from './crypto';
import { createIssuer, removeIssuer } from './issuer';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

const axiosNo404MiddlewareInstance = axios.create();

export async function removedBackendClient(user: User, clientId: string) {
  const clients = await getBackendClients(user);
  const clientToBeRevoked = clients.find((c: any) => c.id === clientId);

  if (!clientToBeRevoked) {
    throw new Error(`Client ${clientId} not found.`);
  }

  const filteredClients = clients.filter((c: any) => c.id !== clientId);

  return Promise.all([
    putBackendClients(user, filteredClients),
    removeIssuer(user, clientToBeRevoked.issuerToken1),
    removeIssuer(user, clientToBeRevoked.issuerToken2),
    deleteClient(user, clientToBeRevoked.id),
  ]);
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

export async function createBackendClient(user: User, client: any, issuerToken1: any, issuerToken2: any) {
  const clientDetails = {
    id: client.id,
    issuerToken1: issuerToken1.id,
    issuerToken2: issuerToken2.id,
  };
  const currentBackends = await getBackendClients(user);
  const backends = [...currentBackends, clientDetails];

  await putBackendClients(user, backends);
}

export function putBackendClients(user: User, backendClients: any[]) {
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

export async function renewToken(user: User, clientId: string, issuerId: string) {
  const clients = await getBackendClients(user);
  const client = clients.find((c: any) => c.id === clientId);

  if (!client) {
    throw new Error(`Client ${clientId} not found.`);
  }

  await removeIssuer(user, issuerId);
  const keyPair = await generateKeyPair();

  const { data: issuer } = await createIssuer(user, client, keyPair);
  await addClientIdentity(user, client.id, issuer);

  if (client.issuerToken1 === issuerId) {
    client.issuerToken1 = issuer.id;
  }
  if (client.issuerToken2 === issuerId) {
    client.issuerToken2 = issuer.id;
  }
  await putBackendClients(user, clients);
}
