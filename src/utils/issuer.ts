import axios from 'axios';
import { User } from '../interfaces/user';
import { Client } from '../interfaces/client';
import { Issuer } from '../interfaces/issuer';
import { KeyPair } from '../interfaces/keyPair';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

const axiosNo404MiddlewareInstance = axios.create();
const UserAgent = `fusebit-portal/${process.env.REACT_APP_VERSION} ${navigator.userAgent}`;

export async function removeIssuer(user: User, clientId: string): Promise<void> {
  const { accountId, token } = user;
  const issuerPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/issuer/iss-${clientId}`;
  await axiosNo404MiddlewareInstance.delete(issuerPath, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': UserAgent,
    },
    validateStatus: (status) => status === 204 || status === 404,
  });
}

export async function createIssuer(user: User, client: Client, keyPair: KeyPair): Promise<Issuer> {
  const issuerId = `iss-${client.id}`;
  const keyId = client.id;
  const issuer = {
    displayName: `API Key issuer associated with the ${client.id} client`,
    publicKeys: [
      {
        keyId,
        publicKey: keyPair.publicKeyPem,
      },
    ],
  };

  const { accountId, token } = user;
  const issuerPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/issuer/${issuerId}`;
  const response = await axiosNo404MiddlewareInstance.post<Issuer>(issuerPath, issuer, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': UserAgent,
    },
  });
  return response.data;
}
