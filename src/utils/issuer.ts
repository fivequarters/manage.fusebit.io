import axios from 'axios';
import { nanoid } from 'nanoid';
import { User } from '../interfaces/user';
import { KeyPair } from './crypto';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

const axiosNo404MiddlewareInstance = axios.create();

export function removeIssuer(user: User, issuerId: string) {
  const { accountId, token } = user;
  const issuerPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/issuer/${issuerId}`;
  return axiosNo404MiddlewareInstance.delete(issuerPath, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createIssuer(user: User, client: any, keyPair: KeyPair) {
  const randomSuffix = nanoid();
  const issuerId = `iss-${randomSuffix}`;
  const keyId = `key-${randomSuffix}`;
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
