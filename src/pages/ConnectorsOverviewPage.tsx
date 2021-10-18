import { FC, ReactElement } from 'react';
import ConnectorsTable from '../components/ConnectorsOverview/ConnectorsTable';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import TabComponent from '../components/TabComponent';
import { useTrackPage } from '../hooks/useTrackPage';

const ConnectorsOverviewPage: FC<{}> = (): ReactElement => {
  useTrackPage('Connectors Overview', 'Connectors');

  return (
    <Layout>
      <Navbar dropdown sectionName="Connectors" connector />
      <TabComponent tabNames={['Overview']} tabObjects={[<ConnectorsTable key="connectorsTable" />]} />
    </Layout>
  );
};

export default ConnectorsOverviewPage;
