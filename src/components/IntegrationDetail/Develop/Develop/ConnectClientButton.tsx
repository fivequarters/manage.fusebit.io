import axios from 'axios';
import { Button } from '@material-ui/core';
import { nanoid } from 'nanoid';

import { Operation } from '../../../../interfaces/operation';
import { useLoader } from '../../../../hooks/useLoader';
import { useError } from '../../../../hooks/useError';
import { generateKeyPair, KeyPair } from '../../../../utils/crypto';
import { useCreateIssuer } from '../../../../hooks/api/v1/account/issuer/useCreateIssuer';
import { useCreateClient } from '../../../../hooks/api/v1/account/client/useCreateClient';
import { usePatchClient } from '../../../../hooks/api/v1/account/client/usePatchClient';
import { usePutStorage } from '../../../../hooks/api/v1/account/storage/usePutStorage';
import { useContext } from '../../../../hooks/useContext';
import { BACKEND_LIST_STORAGE_ID } from '../../../../utils/constants';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

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
      const { accountId, subscriptionId, token } = userData as Required<typeof userData>;
      const currentBackendList = await loadBackendList(accountId, subscriptionId, token);
      if (currentBackendList.length >= 5) {
        throw new Error('You have reached the limit of 5 backend clients registered at Fusebit.');
      }
      const client = await createNewClient(createClient, accountId, subscriptionId);
      const keyPairToken1 = await generateKeyPair();
      const keyPairToken2 = await generateKeyPair();
      const issuerToken1 = await createNewIssuer(createIssuer, accountId, client, keyPairToken1);
      const issuerToken2 = await createNewIssuer(createIssuer, accountId, client, keyPairToken2);
      await patchCreatedClient(patchClient, accountId, issuerToken1, client);
      await patchCreatedClient(patchClient, accountId, issuerToken2, client);
      await addClientToBackendList(
        putStorage,
        accountId,
        subscriptionId,
        client,
        issuerToken1,
        issuerToken2,
        currentBackendList
      );
    } catch (e) {
      createError(e.message);
    } finally {
      removeLoader();
    }
  };

  return (
    <Button
      onClick={() => registerBackend()}
      style={{ width: '160px', marginTop: '10px' }}
      size="large"
      variant="outlined"
      color="primary"
    >
      Add Backend
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
  return persistedIssuer;
};

const patchCreatedClient = async (patchClient: any, accountId: string, issuer: any, client: any) => {
  const clientChanges = {
    identities: [
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
    issuerToken1,
    issuerToken2,
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

const loadBackendList = async (accountId: string, subscriptionId: string, accessToken: string) => {
  try {
    const storageId = BACKEND_LIST_STORAGE_ID;
    const storagePath = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/subscription/${subscriptionId}/storage/${storageId}`;
    const axiosNo404MiddlewareInstance = axios.create();
    const storageResponse = await axiosNo404MiddlewareInstance.get(storagePath, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return storageResponse.data.data;
  } catch (err) {
    if (err.message.includes('404')) {
      return [];
    }
    throw err;
  }
};
