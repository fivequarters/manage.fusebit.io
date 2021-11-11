import { FC, ReactElement } from 'react';
import ConnectorsTable from '@components/ConnectorsOverview/ConnectorsTable';
import Layout from '@components/common/Layout';
import TabComponent from '@components/common/TabComponent';
import { useTrackPage } from '@hooks/useTrackPage';
import ConnectorsNavbar from '@components/common/ConnectorsNavbar';
import useTitle from '@hooks/useTitle';

const ConnectorsOverviewPage: FC<{}> = (): ReactElement => {
  useTrackPage('Connectors Overview', 'Connectors');
  useTitle('Connectors');

  return (
    <Layout>
      <ConnectorsNavbar />
      <TabComponent tabNames={['Overview']} tabObjects={[<ConnectorsTable key="connectorsTable" />]} />
    </Layout>
  );
};

export default ConnectorsOverviewPage;
