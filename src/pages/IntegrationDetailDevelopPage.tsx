import { FC, ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { useAccountIntegrationsGetOne } from '../hooks/api/v2/account/integration/useGetOne';
import { useAuthContext } from '../hooks/useAuthContext';
import { Integration } from '../interfaces/integration';
import Navbar from '../components/common/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';
import TabComponent from '../components/common/TabComponent';
import Develop from '../components/IntegrationDetailDevelop/Develop';
import { useGetRedirectLink } from '../hooks/useGetRedirectLink';

const IntegrationDetailDevelopPage: FC<{}> = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useAuthContext();
  const { data: integrationData } = useAccountIntegrationsGetOne<Integration>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const { getRedirectLink } = useGetRedirectLink();

  useTrackPage('Integration Develop', 'Integration');

  return (
    <Layout>
      <Navbar sectionName={integrationData?.data.id || id} dropdown integrationsLink />
      <TabComponent
        tabNames={['Develop', 'Installs']}
        tabObjects={[<Develop key="develop" />, getRedirectLink(`/integration/${id}/installs`)]}
      />
    </Layout>
  );
};

export default IntegrationDetailDevelopPage;
