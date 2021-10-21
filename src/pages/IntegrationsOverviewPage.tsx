import { FC, ReactElement } from 'react';
import Layout from '../components/common/Layout';
import Navbar from '../components/common/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';
import IntegrationsTable from '../components/IntegrationsOverview/IntegrationsTable';
import TabComponent from '../components/common/TabComponent';

const IntegrationsOverviewPage: FC<{}> = (): ReactElement => {
  useTrackPage('Integrations Overview', 'Integrations');

  return (
    <Layout>
      <Navbar dropdown sectionName="Integrations" integration />
      <TabComponent tabNames={['Overview']} tabObjects={[<IntegrationsTable key="integrationsTable" />]} />
    </Layout>
  );
};

export default IntegrationsOverviewPage;
