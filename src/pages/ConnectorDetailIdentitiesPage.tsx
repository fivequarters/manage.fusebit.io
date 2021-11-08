import { FC, ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@components/common/Layout';
import { useTrackPage } from '@hooks/useTrackPage';
import TabComponent from '@components/common/TabComponent';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import IdentitiesTable from '@components/ConnectorDetailIdentities/IdentitiesTable';
import ConnectorsNavbar from '@components/common/ConnectorsNavbar';
import useTitle from '@hooks/useTitle';

const ConnectorDetailIdentitiesPage: FC<{}> = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { getRedirectLink } = useGetRedirectLink();

  useTrackPage('Connector Identities', 'Connector');
  useTitle(id);

  return (
    <Layout>
      <ConnectorsNavbar />
      <TabComponent
        tabNames={['Configure', 'Identities']}
        tabObjects={[getRedirectLink(`/connector/${id}/configure`), <IdentitiesTable key="identities" />]}
      />
    </Layout>
  );
};

export default ConnectorDetailIdentitiesPage;
