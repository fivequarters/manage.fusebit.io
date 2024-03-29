import { useQuery, UseQueryOptions } from 'react-query';
import { Params } from '@interfaces/api';
import { useAxios } from '@hooks/useAxios';
import { useAuthContext } from '@hooks/useAuthContext';
import { Identity, IdentityList } from '@interfaces/identities';
import { useError } from '@hooks/useError';
import { getAllAccountIdentities } from '@hooks/api/v2/account/identity/useGetAll';

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
      const identities = await getAllAccountIdentities<IdentityList>(
        axios,
        {
          accountId: userData.accountId,
          subscriptionId: userData.subscriptionId,
        },
        {
          tag: `fusebit.tenantId=${tenantId}`,
        }
      );

      const isRelated = (i: Identity) => {
        return connectorIds.includes(i.tags['fusebit.parentEntityId']);
      };

      return identities?.data.items.filter(isRelated);
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
