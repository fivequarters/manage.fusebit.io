import { FC, ReactElement } from 'react';
import Layout from '@components/common/Layout';
import { useTrackPage } from '@hooks/useTrackPage';
import TabComponent from '@components/common/TabComponent';
import IntegrationsNavbar from '@components/common/IntegrationsNavbar';
import Reliability from '@components/Reliability/Reliability';

const ReliabilityPage: FC<{}> = (): ReactElement => {
  useTrackPage('Reliability', 'Reliability');

  return (
    <Layout>
      <IntegrationsNavbar />
      <TabComponent tabNames={['Reliability']} tabObjects={[<Reliability key="reliability" />]} />
    </Layout>
  );
};

export default ReliabilityPage;
