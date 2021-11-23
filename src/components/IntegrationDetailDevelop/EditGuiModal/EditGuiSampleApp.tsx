import React, { useEffect, useState } from 'react';
import { useAuthContext } from '@hooks/useAuthContext';
import { createSampleAppClientUrl } from '@utils/backendClients';

interface IProps {
  componentMap: Record<string, string>;
}

export const EditGuiSampleApp: React.FC<IProps> = ({ componentMap }) => {
  const { userData: user } = useAuthContext();
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const getSampleAppUrl = async () => {
      setUrl(await createSampleAppClientUrl(user, componentMap));
    };
    getSampleAppUrl();
  }, [user, componentMap]);

  return url ? (
    <a target="_blank" rel="noreferrer" href={url}>
      Run a Sample App
    </a>
  ) : (
    <></>
  );
};
