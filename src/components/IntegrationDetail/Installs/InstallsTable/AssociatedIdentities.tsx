import { useAccountIntegrationInstanceIdentitiesGetAll } from '../../../../hooks/api/v2/account/integration/instance/identities/useGetAll';
import AsyncTags from '../../../AsyncTags';

interface Props {
  instanceId?: string;
}

const AssociatedIdentities = ({ instanceId }: Props) => {
  const { isLoading, data } = useAccountIntegrationInstanceIdentitiesGetAll({ instanceId }, { enabled: !!instanceId });

  return (
    <AsyncTags
      isLoading={isLoading}
      tags={(data || [])?.map((i) => ({
        value: i.id,
      }))}
    />
  );
};

export default AssociatedIdentities;
