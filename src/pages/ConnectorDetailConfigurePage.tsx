import { FC, ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Configure from '../components/ConnectorDetailConfigure/ConfigureForm';
import { useTrackPage } from '../hooks/useTrackPage';
import TabComponent from '../components/common/TabComponent';
import { useGetRedirectLink } from '../hooks/useGetRedirectLink';
import ConnectorsNavbar from '../components/common/Navbar/ConnectorsNavbar';

const ConnectorDetailConfigurePage: FC<{}> = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { getRedirectLink } = useGetRedirectLink();

  useTrackPage('Connector Configure', 'Connector');

  return (
    <Layout>
      <ConnectorsNavbar />
      <TabComponent
        tabNames={['Configure', 'Identities']}
        tabObjects={[<Configure key="configure" />, getRedirectLink(`/connector/${id}/identities`)]}
      />
    </Layout>
  );
};

export default ConnectorDetailConfigurePage;
