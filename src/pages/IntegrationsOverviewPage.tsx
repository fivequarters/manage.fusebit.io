import { FC, ReactElement } from 'react';
import Layout from '@components/common/Layout';
import { useTrackPage } from '@hooks/useTrackPage';
import IntegrationsTable from '@components/IntegrationsOverview/IntegrationsTable';
import TabComponent from '@components/common/TabComponent';
import IntegrationsNavbar from '@components/common/IntegrationsNavbar';
import useTitle from '@hooks/useTitle';
import { Helmet } from 'react-helmet';

const IntegrationsOverviewPage: FC<{}> = (): ReactElement => {
  useTrackPage('Integrations Overview', 'Integrations');
  useTitle('Integrations');

  return (
    <Layout>
      <Helmet>
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-10822603500" />
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-10822603500');
          `,
          }}
        />
      </Helmet>
      <IntegrationsNavbar />
      <TabComponent tabNames={['Overview']} tabObjects={[<IntegrationsTable key="integrationsTable" />]} />
    </Layout>
  );
};

export default IntegrationsOverviewPage;
