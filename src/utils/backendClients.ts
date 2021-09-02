import axios from 'axios';
import { User } from '../interfaces/user';
import { deleteClient } from './clients';
import { BACKEND_LIST_STORAGE_ID } from './constants';
import { removeIssuer } from './issuer';

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

  // TODO finish later
}
