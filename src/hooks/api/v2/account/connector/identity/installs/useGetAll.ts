import { useQuery, UseQueryOptions } from 'react-query';
import { Params } from '../../../../../../../interfaces/api';
import { useAxios } from '../../../../../../useAxios';
import { useContext } from '../../../../../../useContext';
import { getAllIntegrations } from '../../../integration/useGetAll';
import { getAllInstances } from '../../../integration/instance/useGetAll';

import { Integration } from '../../../../../../../interfaces/integration';
import { Install, InstallInstance } from '../../../../../../../interfaces/install';
import { useError } from '../../../../../../useError';
import { entityLoopThrough } from '../../../../utils';

export const ACCOUNT_CONNECTOR_IDENTITY_INSTALLS_GET_ALL = 'accountConnectorIdentityInstallsGetAll';

export const useAccountConnectorIdentityInstallsGetAll = (
  { tenantId }: Params,
  options?: UseQueryOptions<unknown, unknown, InstallInstance[]>
) => {
  const { axios } = useAxios();
  const { userData } = useContext();
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

      const instances = await Promise.all(
        (integrations || []).map((integration) => {
          return getAllInstances<Install>(axios, {
            ...userParams,
            id: integration.id,
          });
        })
      );

      return instances
        .map((res) => {
          const {
            data: { items },
          } = res;

          return items.filter((i) => i.tags['fusebit.tenantId'] === tenantId);
        })
        .filter((arr) => arr.length > 0)
        .flat();
    } catch (error) {
      createError(error);
    }
  };

  return useQuery([ACCOUNT_CONNECTOR_IDENTITY_INSTALLS_GET_ALL, { tenantId }], getAllInstallsFromIdentity, {
    enabled: !!userData.token,
    ...options,
  });
};
