import { useAccountIntegrationInstanceIdentitiesGetAll } from '../../../../hooks/api/v2/account/integration/instance/identities/useGetAll';
import AsyncTags from '../../../AsyncTags';

interface Props {
  tenantId?: string;
}

const AssociatedIdentities = ({ tenantId }: Props) => {
  const { isLoading, data } = useAccountIntegrationInstanceIdentitiesGetAll({ tenantId }, { enabled: !!tenantId });

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
