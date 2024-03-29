import { FC, ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@components/common/Layout';
import { useAccountIntegrationsGetOne } from '@hooks/api/v2/account/integration/useGetOne';
import { useAuthContext } from '@hooks/useAuthContext';
import { Integration } from '@interfaces/integration';
import { useTrackPage } from '@hooks/useTrackPage';
import TabComponent from '@components/common/TabComponent';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import Diagram from '@components/IntegrationDetailDevelop/Diagram';
import IntegrationsNavbar from '@components/common/IntegrationsNavbar';
import useTitle from '@hooks/useTitle';
import { INTEGRATION_DETAIL_TABNAMES } from '@utils/constants';

const IntegrationDetailDevelopPage: FC<{}> = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useAuthContext();
  const { isLoading, data } = useAccountIntegrationsGetOne<Integration>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  const { getRedirectLink } = useGetRedirectLink();

  useTrackPage('Integration Develop', 'Integration');
  useTitle(id);

  const integration = data?.data;

  return (
    <Layout>
      <IntegrationsNavbar />
      <TabComponent
        tabNames={INTEGRATION_DETAIL_TABNAMES}
        tabObjects={[
          <Diagram key="diagram" isLoading={isLoading} integration={integration} />,
          getRedirectLink(`/integration/${id}/installs`),
          getRedirectLink(`/integration/${id}/logging`),
          getRedirectLink(`/integration/${id}/health-monitoring`),
          getRedirectLink(`/integration/${id}/reliability`),
        ]}
      />
    </Layout>
  );
};

export default IntegrationDetailDevelopPage;
