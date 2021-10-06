import { FC, ReactElement, useRef } from 'react';
import ConnectorsTable from '../components/ConnectorsOverview/ConnectorsTable';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import TabComponent from '../components/TabComponent';
import { useTrackPage } from '../hooks/useTrackPage';

const ConnectorsOverviewPage: FC<{}> = (): ReactElement => {
  useTrackPage('Connectors Overview', 'Connectors');
  const headless = useRef(true); // the parent has to have this otherwise the mounting of the overview will open the feed picker if there is a query param.

  return (
    <Layout>
      <Navbar dropdown sectionName="Connectors" connector />
      <TabComponent
        tabNames={['Overview']}
        tabObjects={[
          <ConnectorsTable
            key="connectorsTable"
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

export default ConnectorsOverviewPage;
