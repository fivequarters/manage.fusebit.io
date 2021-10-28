import React, { FC, ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@components/common/Layout';
import { useAccountIntegrationsGetOne } from '@hooks/api/v2/account/integration/useGetOne';
import { useAuthContext } from '@hooks/useAuthContext';
import { useTrackPage } from '@hooks/useTrackPage';
import { Integration } from '@interfaces/integration';
import Navbar from '@components/common/Navbar';
import TabComponent from '@components/common/TabComponent';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import InstallsTable from '@components/IntegrationDetailInstalls/InstallsTable';

const IntegrationDetailInstallsPage: FC<{}> = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useAuthContext();
  const { data: integrationData } = useAccountIntegrationsGetOne<Integration>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  const { getRedirectLink } = useGetRedirectLink();

  useTrackPage('Integration Installs', 'Integration');

  return (
    <Layout>
      <Navbar sectionName={integrationData?.data.id || id} dropdown integrationsLink />
      <TabComponent
        tabNames={['Develop', 'Installs']}
        tabObjects={[getRedirectLink(`/integration/${id}/develop`), <InstallsTable key="installs" />]}
      />
    </Layout>
  );
};

export default IntegrationDetailInstallsPage;
