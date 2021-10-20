import { FC, ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Box } from '@material-ui/core';
import styled from 'styled-components';
import Layout from '../components/common/Layout';
import { useAccountIntegrationsGetOne } from '../hooks/api/v2/account/integration/useGetOne';
import { useAuthContext } from '../hooks/useAuthContext';
import { Integration } from '../interfaces/integration';
import Navbar from '../components/common/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';
import TabComponent from '../components/common/TabComponent';
import { useGetRedirectLink } from '../hooks/useGetRedirectLink';
import YourAplication from '../components/IntegrationDetailDevelop/YourAplicationCard';
import ConnectorsCard from '../components/IntegrationDetailDevelop/ConnectorsCard';
import EditorCard from '../components/IntegrationDetailDevelop/EditorCard';

const StyledEditorCard = styled(EditorCard)`
  margin-top: 49px;
`;

const StyledConnectorsCard = styled(ConnectorsCard)`
  margin-left: auto;
`;

const IntegrationDetailDevelopPage: FC<{}> = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useAuthContext();
  const { data: integrationData } = useAccountIntegrationsGetOne<Integration>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const { getRedirectLink } = useGetRedirectLink();

  useTrackPage('Integration Develop', 'Integration');

  return (
    <Layout>
      <Navbar sectionName={integrationData?.data.id || id} dropdown integrationsLink />
      <TabComponent
        tabNames={['Develop', 'Installs']}
        tabObjects={[
          // WIP :(
          <Grid key="asd" container spacing={2}>
            <Grid item sm={12} md={4}>
              <YourAplication />
            </Grid>
            <Grid item sm={12} md={4}>
              <StyledEditorCard name="integration" />
            </Grid>
            <Grid item sm={12} md={4}>
              <StyledConnectorsCard />
            </Grid>
          </Grid>,
          getRedirectLink(`/integration/${id}/installs`),
        ]}
      />
    </Layout>
  );
};

export default IntegrationDetailDevelopPage;
