import { FC, ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { useAccountIntegrationsGetOne } from '../hooks/api/v2/account/integration/useGetOne';
import { useAuthContext } from '../hooks/useAuthContext';
import { Integration } from '../interfaces/integration';
import Navbar from '../components/common/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';
import TabComponent from '../components/common/TabComponent';
import { useGetRedirectLink } from '../hooks/useGetRedirectLink';
import Diagram from '../components/IntegrationDetailDevelop/Diagram';
import FeedPickerMobile from '../components/common/FeedPickerMobile/FeedPickerMobile';
import ConnectorsPickerMobile from '../components/common/ConnectorsPickerMobile';

const IntegrationDetailDevelopPage: FC<{}> = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useAuthContext();
  const { data: integrationData, isLoading } = useAccountIntegrationsGetOne<Integration>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const { getRedirectLink } = useGetRedirectLink();

  useTrackPage('Integration Develop', 'Integration');

  return (
    <Layout>
      <ConnectorsPickerMobile />
      <Navbar sectionName={integrationData?.data.id || id} dropdown integrationsLink />
      <TabComponent
        tabNames={['Develop', 'Installs']}
        tabObjects={[<Diagram key="diagram" isLoading={isLoading} />, getRedirectLink(`/integration/${id}/installs`)]}
      />
    </Layout>
  );
};

export default IntegrationDetailDevelopPage;
