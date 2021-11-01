import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useAuthContext } from '@hooks/useAuthContext';
import { createSampleAppClientUrl } from '@utils/backendClients';

interface IProps {
  componentMap: Record<string, string>;
  buttonsCrashing?: boolean;
  buttonsSize?: 'small' | 'medium' | 'large';
}

export const LinkSampleApp: React.FC<IProps> = ({ componentMap, buttonsCrashing, buttonsSize }) => {
  const { userData: user } = useAuthContext();

  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const getSampleAppUrl = async () => {
      setUrl(await createSampleAppClientUrl(user, componentMap));
    };
    getSampleAppUrl();
  }, [user, componentMap]);

  return url ? (
    <Button
      style={{ width: buttonsCrashing ? 'fit-content' : '293px' }}
      target="_blank"
      rel="noopener"
      href={url}
      variant="outlined"
      color="primary"
      size={buttonsSize || 'large'}
    >
      Run a Sample App!
    </Button>
  ) : (
    <></>
  );
};
