import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';

import { useContext } from '../../../../../hooks/useContext';
import { createSampleAppClientUrl } from '../../../../../utils/backendClients';

interface IProps {
  integrationId?: string;
  integrationType?: string;
}

export const LinkSampleApp: React.FC<IProps> = ({ integrationId, integrationType }: IProps) => {
  const { userData: user } = useContext();

  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const getSampleAppUrl = async () => {
      if (integrationId && integrationType && integrationType === 'slack') {
        setUrl(await createSampleAppClientUrl(user, { [integrationType]: integrationId }));
      }
    };
    getSampleAppUrl();
  }, [user, integrationId, integrationType]);

  return url ? (
    <Button
      style={{ margin: '0 auto', width: '293px' }}
      target="_blank"
      rel="noopener"
      href={url}
      variant="outlined"
      color="primary"
      size="large"
    >
      Try the sample app for {integrationType}!
    </Button>
  ) : (
    <React.Fragment />
  );
};
