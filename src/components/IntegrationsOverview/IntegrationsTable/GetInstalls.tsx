import React, { useEffect } from 'react';
import * as CSC from '@components/globalStyle';
import { useAccountIntegrationInstallGetAll } from '@hooks/api/v2/account/integration/install/useGetAll';
import { useAuthContext } from '@hooks/useAuthContext';
import { InstallList } from '@interfaces/install';

interface Props {
  id: string;
  installs: { id: string; installs: number }[];
  setInstalls: (installs: { id: string; installs: number }[]) => void;
}

const GetInstalls: React.FC<Props> = ({ id, installs, setInstalls }) => {
  const { userData } = useAuthContext();
  const { data: installsData } = useAccountIntegrationInstallGetAll<InstallList>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  useEffect(() => {
    const isSet = installs.find((item) => item.id === id);
    if (!isSet) {
      setInstalls([...installs, { id, installs: installsData?.data.total || 0 }]);
    }
  }, [installsData?.data.total, setInstalls, installs, id]);

  return <>{installsData?.data.total !== undefined ? installsData?.data.total : <CSC.Spinner />}</>;
};

export default GetInstalls;
