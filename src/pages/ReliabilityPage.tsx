import { FC, ReactElement } from 'react';
import Layout from '@components/common/Layout';
import { useTrackPage } from '@hooks/useTrackPage';
import TabComponent from '@components/common/TabComponent';
import IntegrationsNavbar from '@components/common/IntegrationsNavbar';

const ReliabilityPage: FC<{}> = (): ReactElement => {
  useTrackPage('Reliability Page', 'Reliability');

  return (
    <Layout>
      <IntegrationsNavbar />
      <TabComponent tabNames={['Reliability']} tabObjects={[<>asd</>]} />
    </Layout>
  );
};

export default ReliabilityPage;
