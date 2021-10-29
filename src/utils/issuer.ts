import { User } from '@interfaces/user';
import { Client } from '@interfaces/client';
import { Issuer } from '@interfaces/issuer';
import { KeyPair } from '@interfaces/keyPair';
import { createAxiosClient } from './utils';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

export async function removeIssuer(user: User, clientId: string): Promise<void> {
  const { accountId, token } = user;
  const axiosClient = createAxiosClient(token);
  const issuerPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/issuer/iss-${clientId}`;
  await axiosClient.delete(issuerPath, {
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
  const axiosClient = createAxiosClient(token);
  const issuerPath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/issuer/${issuerId}`;
  const response = await axiosClient.post<Issuer>(issuerPath, issuer);
  return response.data;
}
