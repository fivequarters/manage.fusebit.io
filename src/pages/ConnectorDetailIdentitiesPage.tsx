import React, { FC, ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAccountConnectorsGetOne } from '../hooks/api/v2/account/connector/useGetOne';
import { useContext } from '../hooks/useContext';
import { Connector } from '../interfaces/connector';
import Navbar from '../components/common/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';
import TabComponent from '../components/common/TabComponent';
import { useGetRedirectLink } from '../hooks/useGetRedirectLink';
import IdentitiesTable from '../components/ConnectorDetailIdentities/IdentitiesTable';

const ConnectorDetailIdentitiesPage: FC<{}> = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useContext();
  const { data: connectorData } = useAccountConnectorsGetOne<Connector>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const { getRedirectLink } = useGetRedirectLink();

  useTrackPage('Connector Identities', 'Connector');

  return (
    <Layout>
      <Navbar sectionName={connectorData?.data.id || id} dropdown />
      <TabComponent
        tabNames={['Configure', 'Identities']}
        tabObjects={[getRedirectLink(`/connector/${id}/configure`), <IdentitiesTable key="identities" />]}
      />
    </Layout>
  );
};

export default ConnectorDetailIdentitiesPage;
