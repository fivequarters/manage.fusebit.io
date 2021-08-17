import React, { FC, ReactElement } from 'react';
import Layout from '../components/Layout';
import ConnectorsOverview from '../components/Connectors/Overview/ConnectorsOverview';
import Navbar from '../components/Navbar';

const ConnectorsOverviewPage: FC<{}> = (): ReactElement => {
  return (
    <Layout>
      <Navbar dropdown={true} sectionName="Connectors" connector={true} />
      <ConnectorsOverview />
    </Layout>
  );
};

export default ConnectorsOverviewPage;
