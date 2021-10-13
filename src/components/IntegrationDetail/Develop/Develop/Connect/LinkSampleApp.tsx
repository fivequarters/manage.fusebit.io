import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';

import { useContext } from '../../../../../hooks/useContext';
import { createSampleAppClientUrl } from '../../../../../utils/backendClients';

interface IProps {
  componentMap: Record<string, string>;
}

export const LinkSampleApp: React.FC<IProps> = ({ componentMap }: IProps) => {
  const { userData: user } = useContext();

  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const getSampleAppUrl = async () => {
      setUrl(await createSampleAppClientUrl(user, componentMap));
    };
    getSampleAppUrl();
  }, [user, componentMap]);

  const types = Object.keys(componentMap);
  if (types.length > 1) {
    types[types.length - 1] = `and ${types[types.length - 1]}`;
  }
  let typesString: string;
  if (types.length > 2) {
    typesString = Object.keys(componentMap).join(', ');
  } else {
    typesString = Object.keys(componentMap).join(' ');
  }

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
      Try the sample app for {typesString}!
    </Button>
  ) : (
    <></>
  );
};
