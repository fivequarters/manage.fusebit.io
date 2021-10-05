import React from 'react';
import * as CSC from '../../globalStyle';
import { useAccountIntegrationInstanceGetAll } from '../../../hooks/api/v2/account/integration/instance/useGetAll';
import { useContext } from '../../../hooks/useContext';
import { Install } from '../../../interfaces/install';

interface Props {
  id: string;
}

const GetInstances: React.FC<Props> = ({ id }) => {
  const { userData } = useContext();
  const { data: installsData } = useAccountIntegrationInstanceGetAll<Install>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  return <>{installsData?.data.total !== undefined ? installsData?.data.total : <CSC.Spinner />}</>;
};

export default GetInstances;
