import React from 'react';
import * as CSC from '@components/globalStyle';
import { useAuthContext } from '@hooks/useAuthContext';
import { useAccountConnectorIdentityGetAll } from '@hooks/api/v2/account/connector/identity/useGetAll';
import { IdentityList } from '@interfaces/identities';

interface Props {
  id: string;
}

const GetIdentities: React.FC<Props> = ({ id }) => {
  const { userData } = useAuthContext();
  const { data: identitiesData } = useAccountConnectorIdentityGetAll<IdentityList>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  return <>{identitiesData?.data.total !== undefined ? identitiesData?.data.total : <CSC.Spinner />}</>;
};

export default GetIdentities;
