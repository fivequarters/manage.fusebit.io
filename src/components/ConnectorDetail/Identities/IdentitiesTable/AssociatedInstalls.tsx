import { useHistory } from 'react-router-dom';
import { useAccountConnectorIdentityInstallsGetAll } from '../../../../hooks/api/v2/account/connector/identity/installs/useGetAll';
import { useGetRedirectLink } from '../../../../hooks/useGetRedirectLink';
import AsyncTags from '../../../common/AsyncTags';

interface Props {
  tenantId?: string;
  connectorId?: string;
}

const AssociatedInstalls = ({ tenantId, connectorId }: Props) => {
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
        value: i.id,
        onClick: () =>
          history.push(getRedirectLink(`/integration/${i.tags['fusebit.parentEntityId']}/installs?expanded=${i.id}`)),
      }))}
    />
  );
};

export default AssociatedInstalls;
