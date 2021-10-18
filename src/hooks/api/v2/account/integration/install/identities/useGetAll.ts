import { useQuery, UseQueryOptions } from 'react-query';
import { Params } from '../../../../../../../interfaces/api';
import { useAxios } from '../../../../../../useAxios';
import { useAuthContext } from '../../../../../../useAuthContext';
import { getAllConnectors } from '../../../connector/useGetAll';
import { getAllIdentities } from '../../../connector/identity/useGetAll';

import { Connector } from '../../../../../../../interfaces/connector';
import { Identity, IdentityList } from '../../../../../../../interfaces/identities';
import { useError } from '../../../../../../useError';
import { entityLoopThrough } from '../../../../utils';

export const ACCOUNT_INTEGRATION_INSTALL_IDENTITIES_GET_ALL = 'accountIntegrationInstallIdentitiesGetAll';

export const useAccountIntegrationInstallIdentitiesGetAll = (
  { tenantId, connectorIds }: Params,
  options?: UseQueryOptions<unknown, unknown, Identity[]>
) => {
  const { axios } = useAxios();
  const { userData } = useAuthContext();
  const { createError } = useError();

  const getAllIdentitiesFromInstalls = async () => {
    try {
      const userParams = {
        accountId: userData.accountId,
        subscriptionId: userData.subscriptionId,
      };

      const connectors = await entityLoopThrough<Connector>((next) =>
        getAllConnectors(axios, userParams, {
          next,
          count: 1,
        })
      );

      const identities = await Promise.all(
        (connectors || []).map((connector) => {
          return getAllIdentities<IdentityList>(axios, {
            ...userParams,
            id: connector.id,
          });
        })
      );

      return identities
        .map((res) => {
          const {
            data: { items },
          } = res;

          const isRelated = (i: Identity) =>
            i.tags['fusebit.tenantId'] === tenantId && connectorIds.includes(i.tags['fusebit.parentEntityId']);

          return items.filter(isRelated);
        })
        .filter((arr) => arr.length > 0)
        .flat();
    } catch (error) {
      createError(error);
    }
  };

  return useQuery(
    [ACCOUNT_INTEGRATION_INSTALL_IDENTITIES_GET_ALL, { tenantId, connectorIds }],
    getAllIdentitiesFromInstalls,
    {
      enabled: !!userData.token,
      ...options,
    }
  );
};
