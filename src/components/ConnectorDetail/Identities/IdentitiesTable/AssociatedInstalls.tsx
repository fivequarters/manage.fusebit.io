import { useHistory } from 'react-router-dom';
import { useAccountConnectorIdentityInstallsGetAll } from '../../../../hooks/api/v2/account/connector/identity/installs/useGetAll';
import { useGetRedirectLink } from '../../../../hooks/useGetRedirectLink';
import AsyncTags from '../../../AsyncTags';

interface Props {
  tenantId?: string;
}

const AssociatedInstalls = ({ tenantId }: Props) => {
  const { isLoading, data } = useAccountConnectorIdentityInstallsGetAll({ tenantId }, { enabled: !!tenantId });
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
