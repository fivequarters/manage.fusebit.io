import React, { useEffect } from 'react';
import * as CSC from '@components/globalStyle';
import { useAuthContext } from '@hooks/useAuthContext';
import { Connector } from '@interfaces/connector';
import { useAccountConnectorsGetOne } from '@hooks/api/v2/account/connector/useGetOne';

interface Props {
  id: string;
  credentials: { id: string; credentialType: 'Production' | 'Demo' }[];
  setCredentials: (credentials: { id: string; credentialType: 'Production' | 'Demo' }[]) => void;
}

const GetCredentialType: React.FC<Props> = ({ id, credentials, setCredentials }) => {
  const { userData } = useAuthContext();
  const config = useAccountConnectorsGetOne<Connector>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  useEffect(() => {
    if (config?.data) {
      const isCredentialSet = credentials.find((credential) => credential.id === id);
      if (!isCredentialSet) {
        const productionMode = (config?.data?.data?.data?.configuration as any)?.mode?.useProduction;
        setCredentials([...credentials, { id, credentialType: productionMode ? 'Production' : 'Demo' }]);
      }
    }
  }, [config, setCredentials, credentials, id]);

  if (!config.data) {
    return <CSC.Spinner />;
  }

  if ((config?.data?.data?.data?.configuration as any).mode?.useProduction) {
    return <>Production</>;
  }

  return <>Demo</>;
};

export default GetCredentialType;
