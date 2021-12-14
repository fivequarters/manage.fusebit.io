import Layout from '@components/common/Layout';
import EditGui from '@components/IntegrationDetailDevelop/EditGuiModal/EditGui';
import useTitle from '@hooks/useTitle';
import { FC, ReactElement } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useAccountIntegrationsGetOne } from '@hooks/api/v2/account/integration/useGetOne';
import { useAuthContext } from '@hooks/useAuthContext';
import { Integration } from '@interfaces/integration';

const IntegrationDetailEditPage: FC<{}> = (): ReactElement => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { userData } = useAuthContext();
  const { isLoading } = useAccountIntegrationsGetOne<Integration>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  useTitle(id);

  const handleClose = () => {
    history.push('develop');
  };

  return (
    <Layout>
      <EditGui integrationId={id} isLoading={isLoading} onClose={handleClose} />
    </Layout>
  );
};

export default IntegrationDetailEditPage;
