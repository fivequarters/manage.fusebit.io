import { Button } from '@material-ui/core';

import { useLoader } from '../../../../hooks/useLoader';
import { useError } from '../../../../hooks/useError';
import { useContext } from '../../../../hooks/useContext';
import { getBackendClients } from '../../../../utils/backendClients';

export default function ListBackendClients() {
  const { userData } = useContext();
  const { createLoader, removeLoader } = useLoader();
  const { createError } = useError();

  const getBackendClientListener = async () => {
    try {
      createLoader();
      const backendClients = await getBackendClients(userData);
      console.log(backendClients);
    } catch (e) {
      createError(e.message);
    } finally {
      removeLoader();
    }
  };

  return (
    <>
      <Button
        onClick={getBackendClientListener}
        style={{ width: '160px', marginTop: '10px' }}
        size="large"
        variant="outlined"
        color="primary"
      >
        List Backends
      </Button>
    </>
  );
}
