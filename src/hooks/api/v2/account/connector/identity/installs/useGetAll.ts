import { useQuery, UseQueryOptions } from 'react-query';
import { Params } from '@interfaces/api';
import { useAxios } from '@hooks/useAxios';
import { useAuthContext } from '@hooks/useAuthContext';
import { Install, InstallList } from '@interfaces/install';
import { useError } from '@hooks/useError';
import { getConnectorsFromInstall } from '@utils/utils';
import { getAllInstalls } from '../../../integration/install/useSearchAll';

export const ACCOUNT_CONNECTOR_IDENTITY_INSTALLS_GET_ALL = 'accountConnectorIdentityInstallsGetAll';

export const useAccountConnectorIdentityInstallsGetAll = (
  { tenantId, connectorId }: Params,
  options?: UseQueryOptions<unknown, unknown, Install[]>
) => {
  const { axios } = useAxios();
  const { userData } = useAuthContext();
  const { createError } = useError();

  const getAllInstallsFromIdentity = async () => {
    try {
      const installs = await getAllInstalls<InstallList>(
        axios,
        {
          accountId: userData.accountId,
          subscriptionId: userData.subscriptionId,
        },
        {
          tag: `fusebit.tenantId=${tenantId}`,
        }
      );

      const isRelated = (i: Install) => {
        const connectorIds = getConnectorsFromInstall(i);
        return connectorIds.includes(connectorId);
      };

      return installs?.data.items.filter(isRelated);
    } catch (error) {
      createError(error);
    }
  };

  return useQuery(
    [ACCOUNT_CONNECTOR_IDENTITY_INSTALLS_GET_ALL, { tenantId, connectorId }],
    getAllInstallsFromIdentity,
    {
      enabled: !!userData.token,
      ...options,
    }
  );
};
