import { FC, ReactElement } from 'react';
import ConnectorsTable from '../components/ConnectorsOverview/ConnectorsTable';
import Layout from '../components/common/Layout';
import Navbar from '../components/common/Navbar';
import TabComponent from '../components/common/TabComponent';
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
