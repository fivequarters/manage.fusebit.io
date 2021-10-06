import React from 'react';
import * as CSC from '../../globalStyle';
import { useContext } from '../../../hooks/useContext';
import { useAccountConnectorIdentityGetAll } from '../../../hooks/api/v2/account/connector/identity/useGetAll';
import { Identity } from '../../../interfaces/identities';

interface Props {
  id: string;
}

const GetIdentities: React.FC<Props> = ({ id }) => {
  const { userData } = useContext();
  const { data: identitiesData } = useAccountConnectorIdentityGetAll<Identity>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  return <>{identitiesData?.data.total !== undefined ? identitiesData?.data.total : <CSC.Spinner />}</>;
};

export default GetIdentities;
