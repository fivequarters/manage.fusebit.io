import React, { FC, ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAccountIntegrationsGetOne } from '../hooks/api/v2/account/integration/useGetOne';
import { useContext } from '../hooks/useContext';
import { useTrackPage } from '../hooks/useTrackPage';
import { Integration } from '../interfaces/integration';
import IntegrationDetailInstalls from '../components/IntegrationDetail/Installs';
import Navbar from '../components/common/Navbar';

const IntegrationDetailInstallsPage: FC<{}> = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useContext();
  const { data: integrationData } = useAccountIntegrationsGetOne<Integration>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  useTrackPage('Integration Installs', 'Integration');

  return (
    <Layout>
      <Navbar sectionName={integrationData?.data.id || id} dropdown integrationsLink />
      <IntegrationDetailInstalls id={id} />
    </Layout>
  );
};

export default IntegrationDetailInstallsPage;
