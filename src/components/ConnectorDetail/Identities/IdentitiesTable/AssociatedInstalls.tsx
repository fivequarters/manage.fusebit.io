import React from 'react';
import { useAccountConnectorIdentityInstallsGetAll } from '../../../../hooks/api/v2/account/connector/identity/installs/useGetAll';
import * as CSC from '../../../../components/globalStyle';

interface Props {
  identityId?: string;
}

const AssociatedInstalls = ({ identityId }: Props) => {
  const { isLoading, data } = useAccountConnectorIdentityInstallsGetAll({ identityId }, { enabled: !!identityId });

  return <>{isLoading ? <CSC.Spinner /> : <div>{data?.[0].id}</div>}</>;
};

export default AssociatedInstalls;
