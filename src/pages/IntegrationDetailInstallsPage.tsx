import { FC, ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { useTrackPage } from '../hooks/useTrackPage';
import TabComponent from '../components/common/TabComponent';
import { useGetRedirectLink } from '../hooks/useGetRedirectLink';
import InstallsTable from '../components/IntegrationDetailInstalls/InstallsTable';
import IntegrationsNavbar from '../components/common/IntegrationsNavbar/IntegrationsNavbar';

const IntegrationDetailInstallsPage: FC<{}> = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { getRedirectLink } = useGetRedirectLink();

  useTrackPage('Integration Installs', 'Integration');

  return (
    <Layout>
      <IntegrationsNavbar />
      <TabComponent
        tabNames={['Develop', 'Installs']}
        tabObjects={[getRedirectLink(`/integration/${id}/develop`), <InstallsTable key="installs" />]}
      />
    </Layout>
  );
};

export default IntegrationDetailInstallsPage;
