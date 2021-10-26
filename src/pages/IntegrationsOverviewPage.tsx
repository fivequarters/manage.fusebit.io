import { FC, ReactElement } from 'react';
import Layout from '../components/common/Layout';
import Navbar from '../components/common/Navbar/NewNavbar';
import { useTrackPage } from '../hooks/useTrackPage';
import IntegrationsTable from '../components/IntegrationsOverview/IntegrationsTable';
import TabComponent from '../components/common/TabComponent';
import Integrations from '../components/common/Navbar/Integrations';
import { useGetRedirectLink } from '../hooks/useGetRedirectLink';

const IntegrationsOverviewPage: FC<{}> = (): ReactElement => {
  useTrackPage('Integrations Overview', 'Integrations');

  const { getRedirectLink } = useGetRedirectLink();

  return (
    <Layout>
      <Navbar dropdown sectionName="Integrations" integration>
        <Integrations title="integrations" titleLinkTo={getRedirectLink('/integrations/overview')} />
      </Navbar>
      <TabComponent tabNames={['Overview']} tabObjects={[<IntegrationsTable key="integrationsTable" />]} />
    </Layout>
  );
};

export default IntegrationsOverviewPage;
