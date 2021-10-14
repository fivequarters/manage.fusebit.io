import { useHistory } from 'react-router-dom';
import { useAccountConnectorIdentityInstallsGetAll } from '../../../hooks/api/v2/account/connector/identity/installs/useGetAll';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import AsyncTags from '../../common/AsyncTags';

interface Props {
  tenantId?: string;
  connectorId?: string;
}

const AssociatedIntegrations = ({ tenantId, connectorId }: Props) => {
  const { isLoading, data } = useAccountConnectorIdentityInstallsGetAll(
    { tenantId, connectorId },
    { enabled: !!tenantId && !!connectorId }
  );
  const history = useHistory();
  const { getRedirectLink } = useGetRedirectLink();

  return (
    <AsyncTags
      isLoading={isLoading}
      tags={(data || [])?.map((i) => ({
        value: i.tags['fusebit.parentEntityId'] || '',
        onClick: () => history.push(getRedirectLink(`/integration/${i.tags['fusebit.parentEntityId']}/develop`)),
      }))}
    />
  );
};

export default AssociatedIntegrations;
