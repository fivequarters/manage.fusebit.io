import { FC, ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@components/common/Layout';
import { useTrackPage } from '@hooks/useTrackPage';
import TabComponent from '@components/common/TabComponent';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import InstallsTable from '@components/IntegrationDetailInstalls/InstallsTable';
import IntegrationsNavbar from '@components/common/IntegrationsNavbar';
import useTitle from '@hooks/useTitle';

const IntegrationDetailInstallsPage: FC<{}> = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { getRedirectLink } = useGetRedirectLink();

  useTrackPage('Integration Installs', 'Integration');
  useTitle(id);

  return (
    <Layout>
      <IntegrationsNavbar />
      <TabComponent
        tabNames={['Develop', 'Installs', 'Health Monitoring', 'Logging', 'Reliability']}
        tabObjects={[
          getRedirectLink(`/integration/${id}/develop`),
          <InstallsTable key="installs" />,
          getRedirectLink(`/integration/${id}/health-monitoring`),
          getRedirectLink(`/integration/${id}/logging`),
          getRedirectLink(`/integration/${id}/reliability`),
        ]}
      />
    </Layout>
  );
};

export default IntegrationDetailInstallsPage;
