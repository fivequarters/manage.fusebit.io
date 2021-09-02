import axios from 'axios';
import { User } from '../interfaces/user';
import { Client } from '../interfaces/client';
import { KeyPair } from '../interfaces/keyPair';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

const axiosNo404MiddlewareInstance = axios.create();

export function removeIssuer(user: User, clientId: string) {
  const { accountId, token } = user;
  const issuerPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/issuer/iss-${clientId}`;
  return axiosNo404MiddlewareInstance.delete(issuerPath, {
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: (status) => status === 204 || status === 404,
  });
}

export function createIssuer(user: User, client: Client, keyPair: KeyPair) {
  const issuerId = `iss-${client.id}`;
  const keyId = client.id;
  const issuer = {
    displayName: `Issuer for the ${client.id} client`,
    publicKeys: [
      {
        keyId,
        publicKey: keyPair.publicKeyPem,
      },
    ],
  };

  const { accountId, token } = user;
  const issuerPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/issuer/${issuerId}`;
  return axiosNo404MiddlewareInstance.post(issuerPath, issuer, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
