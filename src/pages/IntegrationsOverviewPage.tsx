import { FC, ReactElement } from 'react';
import Layout from '@components/common/Layout';
import { useTrackPage } from '@hooks/useTrackPage';
import IntegrationsTable from '@components/IntegrationsOverview/IntegrationsTable';
import TabComponent from '@components/common/TabComponent';
import IntegrationsNavbar from '@components/common/IntegrationsNavbar';

const IntegrationsOverviewPage: FC<{}> = (): ReactElement => {
  useTrackPage('Integrations Overview', 'Integrations');

  return (
    <Layout>
      <IntegrationsNavbar />
      <TabComponent tabNames={['Overview']} tabObjects={[<IntegrationsTable key="integrationsTable" />]} />
    </Layout>
  );
};

export default IntegrationsOverviewPage;
