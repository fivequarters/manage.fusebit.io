import { FC, ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@components/common/Layout';
import { useTrackPage } from '@hooks/useTrackPage';
import TabComponent from '@components/common/TabComponent';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import IntegrationsNavbar from '@components/common/IntegrationsNavbar';
import useTitle from '@hooks/useTitle';
import Reliability from '@components/IntegrationDetailReliability/Reliability';
import { INTEGRATION_DETAIL_TABNAMES } from '@utils/constants';

const IntegrationDetailReliabilityPage: FC<{}> = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { getRedirectLink } = useGetRedirectLink();

  useTrackPage('Integration Reliability', 'Integration');
  useTitle(id);

  return (
    <Layout>
      <IntegrationsNavbar />
      <TabComponent
        tabNames={INTEGRATION_DETAIL_TABNAMES}
        tabObjects={[
          getRedirectLink(`/integration/${id}/develop`),
          getRedirectLink(`/integration/${id}/installs`),
          getRedirectLink(`/integration/${id}/logging`),
          getRedirectLink(`/integration/${id}/health-monitoring`),
          <Reliability key="reliability" />,
        ]}
      />
    </Layout>
  );
};

export default IntegrationDetailReliabilityPage;
