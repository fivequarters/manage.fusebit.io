import { Button } from '@material-ui/core';
import { useLoader } from '../../../../hooks/useLoader';
import { useError } from '../../../../hooks/useError';
import { generateKeyPair } from '../../../../utils/crypto';
import { generateNonExpiringToken } from '../../../../utils/jwt';
import { useContext } from '../../../../hooks/useContext';
import { createBackendClient, getBackendClients } from '../../../../utils/backendClients';
import { createIssuer } from '../../../../utils/issuer';
import { addClientIdentity, createClient } from '../../../../utils/clients';

export default function CreateBackendClient() {
  const { userData } = useContext();
  const { createLoader, removeLoader } = useLoader();
  const { createError } = useError();

  const registerBackend = async () => {
    try {
      createLoader();
      const currentBackendList = await getBackendClients(userData);
      if (currentBackendList.length >= 5) {
        throw new Error('You have reached the limit of 5 backend clients registered at Fusebit.');
      }
      const { data: client } = await createClient(userData);
      const keyPairToken1 = await generateKeyPair();
      const { data: issuer } = await createIssuer(userData, client, keyPairToken1);
      await addClientIdentity(userData, client.id, issuer);
      await createBackendClient(userData, client, issuer);

      const nonExpiringToken1 = await generateNonExpiringToken(keyPairToken1, issuer, client.id);

      console.log(nonExpiringToken1);
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
