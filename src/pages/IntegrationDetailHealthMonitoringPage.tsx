import { FC, ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@components/common/Layout';
import { useTrackPage } from '@hooks/useTrackPage';
import TabComponent from '@components/common/TabComponent';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import IntegrationsNavbar from '@components/common/IntegrationsNavbar';
import useTitle from '@hooks/useTitle';

const IntegrationDetailHealthMonitoringPage: FC<{}> = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { getRedirectLink } = useGetRedirectLink();

  useTrackPage('Integration HealthMonitoring', 'Integration');
  useTitle(id);

  return (
    <Layout>
      <IntegrationsNavbar />
      <TabComponent
        tabNames={['Develop', 'Installs', 'Health Monitoring']}
        tabObjects={[
          getRedirectLink(`/integration/${id}/develop`),
          getRedirectLink(`/integration/${id}/installs`),
          <>asd</>,
        ]}
      />
    </Layout>
  );
};

export default IntegrationDetailHealthMonitoringPage;
