import { FC, ReactElement, useEffect } from 'react';
import Layout from '@components/common/Layout';
import { useTrackPage } from '@hooks/useTrackPage';
import IntegrationsTable from '@components/IntegrationsOverview/IntegrationsTable';
import TabComponent from '@components/common/TabComponent';
import IntegrationsNavbar from '@components/common/IntegrationsNavbar';
import useTitle from '@hooks/useTitle';

const IntegrationsOverviewPage: FC<{}> = (): ReactElement => {
  useTrackPage('Integrations Overview', 'Integrations');
  useTitle('Integrations');

  useEffect(() => {
    // @ts-ignore
    gtag('event', 'page_view', {
      page_title: 'Integrations',
      page_location: 'Integrations Overview',
      page_path: window.location.pathname,
      send_to: 'AW-10822603500',
    });
  }, []);

  return (
    <Layout>
      <IntegrationsNavbar />
      <TabComponent tabNames={['Overview']} tabObjects={[<IntegrationsTable key="integrationsTable" />]} />
    </Layout>
  );
};

export default IntegrationsOverviewPage;
