import { FC, ReactElement } from 'react';
import Layout from '../components/Layout';
import IntegrationsOverview from '../components/IntegrationsOverview/IntegrationsOverview';
import Navbar from '../components/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';

const IntegrationsOverviewPage: FC<{}> = (): ReactElement => {
  useTrackPage('Integrations Overview', 'Integrations');

  return (
    <Layout>
      <Navbar dropdown={true} sectionName="Integrations" integration={true} />
      <IntegrationsOverview />
    </Layout>
  );
};

export default IntegrationsOverviewPage;
