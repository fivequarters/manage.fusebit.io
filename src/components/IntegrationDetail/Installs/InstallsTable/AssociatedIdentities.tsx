import { useHistory } from 'react-router-dom';
import { useAccountIntegrationInstallIdentitiesGetAll } from '../../../../hooks/api/v2/account/integration/install/identities/useGetAll';
import { useGetRedirectLink } from '../../../../hooks/useGetRedirectLink';
import AsyncTags from '../../../AsyncTags';

interface Props {
  tenantId?: string;
  connectorIds?: string[];
}

const AssociatedIdentities = ({ tenantId, connectorIds }: Props) => {
  const { isLoading, data } = useAccountIntegrationInstallIdentitiesGetAll(
    { tenantId, connectorIds },
    { enabled: !!tenantId && (connectorIds || []).length > 0 }
  );
  const history = useHistory();
  const { getRedirectLink } = useGetRedirectLink();

  return (
    <AsyncTags
      isLoading={isLoading}
      tags={(data || [])?.map((i) => ({
        value: i.id,
        onClick: () =>
          history.push(getRedirectLink(`/connector/${i.tags['fusebit.parentEntityId']}/identities?expanded=${i.id}`)),
      }))}
    />
  );
};

export default AssociatedIdentities;
