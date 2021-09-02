import { Button } from '@material-ui/core';
import { nanoid } from 'nanoid';

import { Operation } from '../../../../interfaces/operation';
import { useLoader } from '../../../../hooks/useLoader';
import { useError } from '../../../../hooks/useError';
import { generateKeyPair, KeyPair } from '../../../../utils/crypto';
import { generateNonExpiringToken } from '../../../../utils/jwt';
import { useCreateIssuer } from '../../../../hooks/api/v1/account/issuer/useCreateIssuer';
import { useCreateClient } from '../../../../hooks/api/v1/account/client/useCreateClient';
import { usePatchClient } from '../../../../hooks/api/v1/account/client/usePatchClient';
import { usePutStorage } from '../../../../hooks/api/v1/account/storage/usePutStorage';
import { useContext } from '../../../../hooks/useContext';
import { BACKEND_LIST_STORAGE_ID } from '../../../../utils/constants';
import { getBackendClients } from '../../../../utils/backendClients';

export default function ConnectClientButton() {
  const { userData } = useContext();
  const { createLoader, removeLoader } = useLoader();
  const { createError } = useError();
  const createIssuer = useCreateIssuer<Operation>();
  const createClient = useCreateClient<Operation>();
  const patchClient = usePatchClient<Operation>();
  const putStorage = usePutStorage<Operation>();

  const registerBackend = async () => {
    try {
      createLoader();
      const { accountId, subscriptionId } = userData as Required<typeof userData>;
      const currentBackendList = await getBackendClients(userData);
      if (currentBackendList.length >= 5) {
        throw new Error('You have reached the limit of 5 backend clients registered at Fusebit.');
      }
      let client = await createNewClient(createClient, accountId, subscriptionId);
      const keyPairToken1 = await generateKeyPair();
      const keyPairToken2 = await generateKeyPair();
      const issuerToken1 = await createNewIssuer(createIssuer, accountId, client, keyPairToken1);
      const issuerToken2 = await createNewIssuer(createIssuer, accountId, client, keyPairToken2);
      client = await patchCreatedClient(patchClient, accountId, issuerToken1, client);
      client = await patchCreatedClient(patchClient, accountId, issuerToken2, client);
      await addClientToBackendList(
        putStorage,
        accountId,
        subscriptionId,
        client,
        issuerToken1,
        issuerToken2,
        currentBackendList
      );

      const nonExpiringToken1 = await generateNonExpiringToken(keyPairToken1, issuerToken1, client.id);
      const nonExpiringToken2 = await generateNonExpiringToken(keyPairToken2, issuerToken2, client.id);

      console.log(nonExpiringToken1);
      console.log(nonExpiringToken2);
    } catch (e) {
      createError(e.message);
    } finally {
      removeLoader();
    }
  };

  return (
    <Button
      onClick={() => registerBackend()}
      style={{ width: '100%', marginTop: '10px' }}
      size="large"
      variant="outlined"
      color="primary"
    >
      Add
    </Button>
  );
}

const createNewClient = async (createClient: any, accountId: string, subscriptionId: string) => {
  const client = {
    displayName: 'My Backend',
    access: {
      allow: [
        {
          action: '*',
          resource: `/account/${accountId}/subscription/${subscriptionId}`,
        },
      ],
    },
  };
  const response = await createClient.mutateAsync({
    accountId: accountId,
    client,
  });
  const persistedClient = response.data;
  return persistedClient;
};

const createNewIssuer = async (createIssuer: any, accountId: string, client: any, keyPair: KeyPair) => {
  const randomSuffix = nanoid();
  const issuerId = `iss-${randomSuffix}`;
  const keyId = `key-${randomSuffix}`;
  const newIssuer = {
    id: issuerId,
    displayName: `Issuer for the ${client.id} client`,
    publicKeys: [
      {
        keyId,
        publicKey: keyPair.publicKeyPem,
      },
    ],
  };
  const response = await createIssuer.mutateAsync({
    accountId: accountId,
    issuer: newIssuer,
  });
  const persistedIssuer = response.data;
  persistedIssuer.keyId = keyId;
  return persistedIssuer;
};

const patchCreatedClient = async (patchClient: any, accountId: string, issuer: any, client: any) => {
  const existingIdentities = client.identities || [];
  const clientChanges = {
    identities: [
      ...existingIdentities,
      {
        issuerId: issuer.id,
        subject: client.id,
      },
    ],
  };
  const response = await patchClient.mutateAsync({
    accountId: accountId,
    clientId: client.id,
    clientChanges,
  });
  const patchedClient = response.data;
  return patchedClient;
};

const addClientToBackendList = async (
  putStorage: any,
  accountId: string,
  subscriptionId: string,
  client: any,
  issuerToken1: any,
  issuerToken2: any,
  currentBackendList: string[]
) => {
  const clientDetails = {
    id: client.id,
    issuerToken1: issuerToken1.id,
    issuerToken2: issuerToken2.id,
  };
  const data = [...currentBackendList, clientDetails];
  const storageId = BACKEND_LIST_STORAGE_ID;
  await putStorage.mutateAsync({
    accountId,
    subscriptionId,
    storageId,
    data,
  });
};
