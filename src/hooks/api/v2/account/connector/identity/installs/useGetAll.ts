import { useQuery, UseQueryOptions } from 'react-query';
import { Params } from '@interfaces/api';
import { useAxios } from '@hooks/useAxios';
import { useAuthContext } from '@hooks/useAuthContext';
import { getAllIntegrations } from '@hooks/api/v2/account/integration/useGetAll';
import { getAllInstalls } from '@hooks/api/v2/account/integration/install/useGetAll';
import { Integration } from '@interfaces/integration';
import { Install, InstallList } from '@interfaces/install';
import { useError } from '@hooks/useError';
import { entityLoopThrough } from '@hooks/api/v2/utils';
import { getConnectorsFromInstall } from '@utils/utils';

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
      const userParams = {
        accountId: userData.accountId,
        subscriptionId: userData.subscriptionId,
      };

      const integrations = await entityLoopThrough<Integration>((next) =>
        getAllIntegrations(axios, userParams, {
          next,
        })
      );

      const installs = await Promise.all(
        (integrations || []).map((integration) => {
          return getAllInstalls<InstallList>(axios, {
            ...userParams,
            id: integration.id,
          });
        })
      );

      return installs
        .map((res) => {
          const {
            data: { items },
          } = res;

          const isRelated = (i: Install) => {
            const connectorIds = getConnectorsFromInstall(i);

            return i.tags['fusebit.tenantId'] === tenantId && connectorIds.includes(connectorId);
          };

          return items.filter(isRelated);
        })
        .filter((arr) => arr.length > 0)
        .flat();
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
