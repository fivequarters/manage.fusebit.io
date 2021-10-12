import { FC, ReactElement } from 'react';
import ConnectorsOverview from '../components/ConnectorsOverview';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';

const ConnectorsOverviewPage: FC<{}> = (): ReactElement => {
  useTrackPage('Connectors Overview', 'Connectors');

  return (
    <Layout>
      <Navbar dropdown sectionName="Connectors" connector />
      <ConnectorsOverview />
    </Layout>
  );
};

export default ConnectorsOverviewPage;
