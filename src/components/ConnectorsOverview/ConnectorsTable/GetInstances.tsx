import React from 'react';
import * as CSC from '../../globalStyle';
import { useAccountIntegrationInstallGetAll } from '../../../hooks/api/v2/account/integration/install/useGetAll';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { InstallList } from '../../../interfaces/install';

interface Props {
  id: string;
}

const GetInstalls: React.FC<Props> = ({ id }) => {
  const { userData } = useAuthContext();
  const { data: installsData } = useAccountIntegrationInstallGetAll<InstallList>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  return <>{installsData?.data.total !== undefined ? installsData?.data.total : <CSC.Spinner />}</>;
};

export default GetInstalls;
