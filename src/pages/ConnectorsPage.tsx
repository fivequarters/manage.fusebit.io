import React, { FC, ReactElement } from 'react';
import Layout from '../components/Layout';
import Connectors from '../components/Connectors';
import Navbar from '../components/Navbar';

const ConnectorsPage: FC<{}> = (): ReactElement => {
  return (
    <Layout>
      <Navbar dropdown={true} sectionName='Connectors' connector={true} />
      <Connectors />
    </Layout>
  );
};

export default ConnectorsPage;
