import React, { FC, ReactElement } from 'react';
import Layout from '../components/Layout';
import IntegrationsOverview from '../components/Integrations/Overview/IntegrationsOverview';
import Navbar from '../components/Navbar';

const IntegrationsOverviewPage: FC<{}> = (): ReactElement => {
  return (
    <Layout>
      <Navbar dropdown={true} sectionName="Integrations" integration={true} />
      <IntegrationsOverview />
    </Layout>
  );
};

export default IntegrationsOverviewPage;
