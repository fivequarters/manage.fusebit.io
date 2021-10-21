import { User } from '../interfaces/user';
import { addClientIdentity, createClient, patchClient, removeClient } from './clients';
import { BACKEND_LIST_STORAGE_ID } from './constants';
import { createAxiosClient } from './utils';
import { generateKeyPair } from './crypto';
import { generateNonExpiringToken, signJwt } from './jwt';
import { createIssuer, removeIssuer } from './issuer';
import { BackendClient } from '../interfaces/backendClient';
import { Storage } from '../interfaces/storage';

const { REACT_APP_FUSEBIT_DEPLOYMENT, REACT_APP_SAMPLE_APP_URL, REACT_APP_SAMPLE_APP_KEY } = process.env;

export async function getBackendClients(user: User): Promise<BackendClient[]> {
  try {
    const { accountId, subscriptionId, token } = user;
    const axiosClient = createAxiosClient(token);
    const clientsPaths = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/subscription/${subscriptionId}/storage/${BACKEND_LIST_STORAGE_ID}`;
    const clientsResponse = await axiosClient.get<Storage<BackendClient>>(clientsPaths);
    return clientsResponse.data.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      return [];
    }
    throw err;
  }
}

export async function putBackendClients(user: User, backendClients: BackendClient[]): Promise<Storage<BackendClient>> {
  const { accountId, subscriptionId, token } = user;
  const axiosClient = createAxiosClient(token);
  const clientsPaths = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/subscription/${subscriptionId}/storage/${BACKEND_LIST_STORAGE_ID}`;
  const response = await axiosClient.put<Storage<BackendClient>>(clientsPaths, { data: backendClients });
  return response.data;
}

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

export async function createSampleAppClientUrl(user: User, integrations: Record<string, string>): Promise<string> {
  const { accountId, subscriptionId, token } = user;
  const url = new URL(`${REACT_APP_SAMPLE_APP_URL}`);

  const configuration = {
    SLACK_INTEGRATION_ID: integrations.slack,
    HUBSPOT_INTEGRATION_ID: undefined,
    FUSEBIT_INTEGRATION_URL: `${REACT_APP_FUSEBIT_DEPLOYMENT}/v2/account/${accountId}/subscription/${subscriptionId}/integration`,
    FUSEBIT_JWT: token,
  };

  const hmacKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(REACT_APP_SAMPLE_APP_KEY),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Create a JWT that'll act as an envelope for the sample app
  const sampleAppJwt = await signJwt(
    { sub: `${user.id}`, aud: `${REACT_APP_SAMPLE_APP_URL}`, ...configuration },
    { displayName: 'Sample App Key', id: `${user.id}-issuer`, publicKeys: [{ keyId: 'sample', publicKey: 'sample' }] },
    hmacKey,
    { name: 'HMAC', hash: 'SHA-256', algorithm: 'HS256' }
  );

  // Add it to the URL, and return
  url.hash = `configuration=${sampleAppJwt}`;
  return url.toString();
}

export async function removedBackendClient(user: User, clientId: string): Promise<void> {
  const clients = await getBackendClients(user);
  const filteredClients = clients.filter((c) => c.id !== clientId);

  await removeIssuer(user, clientId);
  await removeClient(user, clientId);
  await putBackendClients(user, filteredClients);
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
  const axiosClient = createAxiosClient(token);
  const clientsPaths = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/subscription/${subscriptionId}/storage/${BACKEND_LIST_STORAGE_ID}`;
  await patchClient(user, { id, displayName: backendClient.name });
  const response = await axiosClient.put<Storage<BackendClient>>(clientsPaths, { data: backendClients });
  return response.data;
}
