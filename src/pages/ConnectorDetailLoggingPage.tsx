import { FC, ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@components/common/Layout';
import { useTrackPage } from '@hooks/useTrackPage';
import TabComponent from '@components/common/TabComponent';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import ConnectorsNavbar from '@components/common/ConnectorsNavbar';
import useTitle from '@hooks/useTitle';
import Logging from '@components/ConnectorDetailLogging/Logging';

const ConnectorDetailLoggingPage: FC<{}> = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { getRedirectLink } = useGetRedirectLink();

  useTrackPage('Connector Configure', 'Connector', { connector: id });
  useTitle(id);

  return (
    <Layout>
      <ConnectorsNavbar />
      <TabComponent
        tabNames={['Configure', 'Identities', 'Logging']}
        tabObjects={[
          getRedirectLink(`/connector/${id}/configure`),
          getRedirectLink(`/connector/${id}/identities`),
          <Logging key="logging" />,
        ]}
      />
    </Layout>
  );
};

export default ConnectorDetailLoggingPage;
