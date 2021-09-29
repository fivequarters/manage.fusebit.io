import React, { FC, ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAccountConnectorsGetOne } from '../hooks/api/v2/account/connector/useGetOne';
import { useContext } from '../hooks/useContext';
import { Connector } from '../interfaces/connector';
import Identities from '../components/ConnectorDetail/Identities';
import Navbar from '../components/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';

const ConnectorDetailIdentitiesPage: FC<{}> = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useContext();
  const { data: connectorData } = useAccountConnectorsGetOne<Connector>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  useTrackPage('Connector Identities', 'Connector');

  return (
    <Layout>
      <Navbar sectionName={connectorData?.data.id || id} dropdown={true} />
      <Identities id={id} />
    </Layout>
  );
};

export default ConnectorDetailIdentitiesPage;
