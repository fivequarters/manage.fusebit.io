import { FC, ReactElement, useRef } from 'react';
import Layout from '../components/Layout';
import Navbar from '../components/common/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';
import IntegrationsTable from '../components/IntegrationsOverview/IntegrationsTable/IntegrationsTable';
import TabComponent from '../components/common/TabComponent';

const IntegrationsOverviewPage: FC<{}> = (): ReactElement => {
  useTrackPage('Integrations Overview', 'Integrations');
  const headless = useRef(true); // the parent has to have this otherwise the mounting of the overview will open the feed picker if there is a query param.

  return (
    <Layout>
      <Navbar dropdown sectionName="Integrations" integration />
      <TabComponent
        tabNames={['Overview']}
        tabObjects={[
          <IntegrationsTable
            key="integrationsTable"
            headless={!!headless}
            setHeadless={(value: boolean) => {
              headless.current = value;
            }}
          />,
        ]}
      />
    </Layout>
  );
};

export default IntegrationsOverviewPage;
