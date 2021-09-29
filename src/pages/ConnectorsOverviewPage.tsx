import React, { FC, ReactElement } from 'react';
import Layout from '../components/Layout';
import ConnectorsOverview from '../components/Connectors/Overview/ConnectorsOverview';
import Navbar from '../components/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';

const ConnectorsOverviewPage: FC<{}> = (): ReactElement => {
  useTrackPage('Connectors Overview', 'Connectors');

  return (
    <Layout>
      <Navbar dropdown={true} sectionName="Connectors" connector={true} />
      <ConnectorsOverview />
    </Layout>
  );
};

export default ConnectorsOverviewPage;
