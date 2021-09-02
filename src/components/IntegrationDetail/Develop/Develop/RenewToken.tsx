import { useState } from 'react';
import { Button } from '@material-ui/core';

import { useLoader } from '../../../../hooks/useLoader';
import { useError } from '../../../../hooks/useError';
import { useContext } from '../../../../hooks/useContext';
import { renewToken } from '../../../../utils/backendClients';

export default function RenewToken() {
  const { userData } = useContext();
  const [backendClientId, setBackendClientID] = useState('');
  const [issuerId, setIssuerID] = useState('');
  const { createLoader, removeLoader } = useLoader();
  const { createError } = useError();

  const renewTokenListener = async () => {
    try {
      createLoader();
      await renewToken(userData, backendClientId, issuerId);
    } catch (e) {
      createError(e.message);
    } finally {
      removeLoader();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <input
          style={{ width: '50%' }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBackendClientID(e.target.value)}
          placeholder="Backend ID"
        />
        <input
          style={{ width: '50%' }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIssuerID(e.target.value)}
          placeholder="Issuer ID"
        />
      </div>
      <Button onClick={renewTokenListener} style={{ width: '100%' }} size="large" variant="outlined" color="primary">
        Renew
      </Button>
    </div>
  );
}
