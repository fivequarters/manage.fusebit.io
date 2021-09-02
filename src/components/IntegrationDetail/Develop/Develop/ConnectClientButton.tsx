import { Button } from '@material-ui/core';

import { Operation } from '../../../../interfaces/operation';
import { useLoader } from '../../../../hooks/useLoader';
import { useError } from '../../../../hooks/useError';
import { generateKeyPair } from '../../../../utils/crypto';
import { generateNonExpiringToken } from '../../../../utils/jwt';
import { usePutStorage } from '../../../../hooks/api/v1/account/storage/usePutStorage';
import { useContext } from '../../../../hooks/useContext';
import { BACKEND_LIST_STORAGE_ID } from '../../../../utils/constants';
import { getBackendClients } from '../../../../utils/backendClients';
import { createIssuer } from '../../../../utils/issuer';
import { addClientIdentity, createClient } from '../../../../utils/clients';

export default function ConnectClientButton() {
  const { userData } = useContext();
  const { createLoader, removeLoader } = useLoader();
  const { createError } = useError();
  const putStorage = usePutStorage<Operation>();

  const registerBackend = async () => {
    try {
      createLoader();
      const { accountId, subscriptionId } = userData as Required<typeof userData>;
      const currentBackendList = await getBackendClients(userData);
      if (currentBackendList.length >= 5) {
        throw new Error('You have reached the limit of 5 backend clients registered at Fusebit.');
      }
      const { data: client } = await createClient(userData);
      const keyPairToken1 = await generateKeyPair();
      const keyPairToken2 = await generateKeyPair();
      const { data: issuerToken1 } = await createIssuer(userData, client, keyPairToken1);
      const { data: issuerToken2 } = await createIssuer(userData, client, keyPairToken2);
      await addClientIdentity(userData, client.id, issuerToken1);
      await addClientIdentity(userData, client.id, issuerToken2);
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
