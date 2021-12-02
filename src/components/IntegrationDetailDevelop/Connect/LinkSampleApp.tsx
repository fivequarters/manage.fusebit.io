import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useAuthContext } from '@hooks/useAuthContext';
import { trackEvent } from '@utils/analytics';
import { createSampleAppClientUrl } from '@utils/backendClients';
import { Integration } from '@interfaces/integration';

interface IProps {
  componentMap: Record<string, string>;
  buttonsCrashing?: boolean;
  buttonsSize?: 'small' | 'medium' | 'large';
  integration?: Integration;
}

const openSampleApp = (url: string, integration?: Integration) => {
  trackEvent('Run Sample App Button Clicked', 'My Application', { Integration: integration?.tags['fusebit.feedId'] });
  const sampleAppTab = window.open() as Window;
  sampleAppTab.opener = null;
  sampleAppTab.location.href = url;
  sampleAppTab.focus();
};

export const LinkSampleApp: React.FC<IProps> = ({ componentMap, buttonsCrashing, buttonsSize, integration }) => {
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
      onClick={() => {
        openSampleApp(url, integration);
      }}
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
