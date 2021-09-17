import { useAccountConnectorIdentityInstallsGetAll } from '../../../../hooks/api/v2/account/connector/identity/installs/useGetAll';
import AsyncTags from '../../../AsyncTags';

interface Props {
  identityId?: string;
}

const AssociatedInstalls = ({ identityId }: Props) => {
  const { isLoading, data } = useAccountConnectorIdentityInstallsGetAll({ identityId }, { enabled: !!identityId });

  return <AsyncTags isLoading={isLoading} tags={(data || [])?.map((i) => i.id)} />;
};

export default AssociatedInstalls;
