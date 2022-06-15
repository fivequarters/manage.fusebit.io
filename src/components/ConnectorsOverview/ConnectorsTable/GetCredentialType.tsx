import React from 'react';
import * as CSC from '@components/globalStyle';
import { useAuthContext } from '@hooks/useAuthContext';
import { Connector } from '@interfaces/connector';
import { useAccountConnectorsGetOne } from '@hooks/api/v2/account/connector/useGetOne';

interface Props {
  id: string;
}

const GetCredentialType: React.FC<Props> = ({ id }) => {
  const { userData } = useAuthContext();
  const config = useAccountConnectorsGetOne<Connector>({
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
    enabled: userData.token,
    id,
  });

  if (!config.data) {
    return <CSC.Spinner />;
  }

  if ((config?.data?.data?.data?.configuration as any).mode?.useProduction) {
    return <>Production</>;
  }

  return <>Demo</>;
};

export default GetCredentialType;
