import { Button } from '@material-ui/core';

import { useLoader } from '../../hooks/useLoader';
import { useError } from '../../hooks/useError';
import { useContext } from '../../hooks/useContext';
import { getBackendClients } from '../../utils/backendClients';

export default function ListBackendClients() {
  const { userData } = useContext();
  const { createLoader, removeLoader } = useLoader();
  const { createError } = useError();

  const getBackendClientListener = async () => {
    try {
      createLoader();
      await getBackendClients(userData);
    } catch (e) {
      createError(e);
    } finally {
      removeLoader();
    }
  };

  return (
    <Button
      onClick={getBackendClientListener}
      style={{ width: '100%', marginTop: '10px' }}
      size="large"
      variant="outlined"
      color="primary"
    >
      List
    </Button>
  );
}
