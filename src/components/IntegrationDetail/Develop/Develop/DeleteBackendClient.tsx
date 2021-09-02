import { useState } from 'react';
import { Button, TextField } from '@material-ui/core';

import { useLoader } from '../../../../hooks/useLoader';
import { useError } from '../../../../hooks/useError';
import { useContext } from '../../../../hooks/useContext';
import { removedBackendClient } from '../../../../utils/backendClients';

export default function DeleteBackendClient() {
  const { userData } = useContext();
  const [backendClientId, setBackendClientID] = useState('');
  const { createLoader, removeLoader } = useLoader();
  const { createError } = useError();

  const removeBackendClientListener = async () => {
    try {
      createLoader();
      await removedBackendClient(userData, backendClientId);
    } catch (e) {
      createError(e.message);
    } finally {
      removeLoader();
    }
  };

  return (
    <>
      <TextField
        style={{ width: '100%' }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBackendClientID(e.target.value)}
        label="Backend Client ID"
      />
      <Button
        onClick={removeBackendClientListener}
        style={{ width: '160px', marginTop: '10px' }}
        size="large"
        variant="outlined"
        color="primary"
      >
        Remove Backend
      </Button>
    </>
  );
}
