import React, { FC, ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAccountIntegrationsGetOne } from '../hooks/api/v2/account/integration/useGetOne';
import { useContext } from '../hooks/useContext';
import { Integration } from '../interfaces/integration';
import IntegrationDetailDevelop from '../components/IntegrationDetail/Develop';
import Navbar from '../components/common/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';

const IntegrationDetailDevelopPage: FC<{}> = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useContext();
  const { data: integrationData } = useAccountIntegrationsGetOne<Integration>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  useTrackPage('Integration Develop', 'Integration');

  return (
    <Layout>
      <Navbar sectionName={integrationData?.data.id || id} dropdown integrationsLink />
      <IntegrationDetailDevelop id={id} />
    </Layout>
  );
};

export default IntegrationDetailDevelopPage;
