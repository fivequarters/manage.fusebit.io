import { Button } from '@material-ui/core';
import { useLoader } from '../../../../hooks/useLoader';
import { useError } from '../../../../hooks/useError';
import { useContext } from '../../../../hooks/useContext';
import { createBackendClient } from '../../../../utils/backendClients';

export default function CreateBackendClient() {
  const { userData } = useContext();
  const { createLoader, removeLoader } = useLoader();
  const { createError } = useError();

  const registerBackend = async () => {
    try {
      createLoader();
      const nonExpiringToken = await createBackendClient(userData);
      console.log(nonExpiringToken);
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
