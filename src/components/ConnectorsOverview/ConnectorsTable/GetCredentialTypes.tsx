import React from 'react';
import * as CSC from '@components/globalStyle';
import { useAuthContext } from '@hooks/useAuthContext';
import { Connector } from '@interfaces/connector';
import { useAccountConnectorsGetOne } from '@hooks/api/v2/account/connector/useGetOne';
import { Chip } from '@material-ui/core';

interface Props {
  id: string;
}

const GetCredentialTypes: React.FC<Props> = ({ id }) => {
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

  if ((config.data.data.data.configuration as any).mode.useProduction) {
    return <Chip label="True" variant="outlined" />;
  }

  return <Chip label="False" />;
};

export default GetCredentialTypes;
