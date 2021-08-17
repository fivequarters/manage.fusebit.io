import React, { FC, ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAccountConnectorsGetOne } from '../hooks/api/v2/account/connector/useGetOne';
import { useContext } from '../hooks/useContext';
import { Connector } from '../interfaces/connector';
import Configure from '../components/ConnectorDetail/Configure';
import Navbar from '../components/Navbar';

const ConnectorDetailConfigurePage: FC<{}> = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useContext();
  const { data: connectorData } = useAccountConnectorsGetOne<Connector>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  return (
    <Layout>
      <Navbar sectionName={connectorData?.data.id || id} dropdown={true} />
      <Configure id={id} />
    </Layout>
  );
};

export default ConnectorDetailConfigurePage;
