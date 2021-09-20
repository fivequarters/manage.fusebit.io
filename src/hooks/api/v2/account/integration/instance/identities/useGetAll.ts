import { useQuery, UseQueryOptions } from 'react-query';
import { Params } from '../../../../../../../interfaces/api';
import { useAxios } from '../../../../../../useAxios';
import { useContext } from '../../../../../../useContext';
import { getAllConnectors } from '../../../connector/useGetAll';
import { getAllIdentities } from '../../../connector/identity/useGetAll';

import { Connector } from '../../../../../../../interfaces/connector';
import { Identity, IdentityInstance } from '../../../../../../../interfaces/identities';
import { useError } from '../../../../../../useError';

export const ACCOUNT_INTEGRATION_INSTANCE_IDENTITIES_GET_ALL = 'accountIntegrationInstanceIdentitiesGetAll';

export const useAccountIntegrationInstanceIdentitiesGetAll = (
  { instanceId }: Params,
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

      const { data } = await getAllConnectors<{ items: Connector[] }>(axios, userParams);

      const { items: connectors } = data;

      const identitiesPromises = await Promise.all(
        (connectors || []).map((connector) => {
          return getAllIdentities<Identity>(axios, {
            ...userParams,
            id: connector.id,
          });
        })
      );

      return identitiesPromises
        .map((res) => {
          const {
            data: { items },
          } = res;

          return items.filter((i) => i.tags['fusebit.tenantId'] === instanceId);
        })
        .filter((arr) => arr.length > 0)
        .flat();
    } catch (error) {
      createError(error);
    }
  };

  return useQuery([ACCOUNT_INTEGRATION_INSTANCE_IDENTITIES_GET_ALL, { instanceId }], getAllIdentitiesFromInstalls, {
    enabled: !!userData.token,
    ...options,
  });
};
