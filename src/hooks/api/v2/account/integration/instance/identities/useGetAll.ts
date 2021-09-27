import { useQuery, UseQueryOptions } from 'react-query';
import { Params } from '../../../../../../../interfaces/api';
import { useAxios } from '../../../../../../useAxios';
import { useContext } from '../../../../../../useContext';
import { getAllConnectors } from '../../../connector/useGetAll';
import { getAllIdentities } from '../../../connector/identity/useGetAll';

import { Connector } from '../../../../../../../interfaces/connector';
import { Identity, IdentityInstance } from '../../../../../../../interfaces/identities';
import { useError } from '../../../../../../useError';
import { entityLoopThrough } from '../../../../utils';

export const ACCOUNT_INTEGRATION_INSTANCE_IDENTITIES_GET_ALL = 'accountIntegrationInstanceIdentitiesGetAll';

export const useAccountIntegrationInstanceIdentitiesGetAll = (
  { tenantId, connectorIds }: Params,
  options?: UseQueryOptions<unknown, unknown, IdentityInstance[]>
) => {
  const { axios } = useAxios();
  const { userData } = useContext();
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
          return getAllIdentities<Identity>(axios, {
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

          const isRelated = (i: IdentityInstance) =>
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
    [ACCOUNT_INTEGRATION_INSTANCE_IDENTITIES_GET_ALL, { tenantId, connectorIds }],
    getAllIdentitiesFromInstalls,
    {
      enabled: !!userData.token,
      ...options,
    }
  );
};
