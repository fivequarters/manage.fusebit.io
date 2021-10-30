import React, { FC, ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '@components/common/Layout';
import Navbar from '@components/common/Navbar';
import { useTrackPage } from '@hooks/useTrackPage';
import AuthenticationDetail from '@components/AuthenticationDetailOverview/Overview';
import TabComponent from '@components/common/TabComponent';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import { useAuthContext } from '@hooks/useAuthContext';
import NavbarBreadcrumb from '@components/common/NavbarBreadcrumb';

const AuthenticationDetailPage: FC<{}> = (): ReactElement => {
  useTrackPage('Team User Details', 'Team');
  const history = useHistory();
  const { getRedirectLink } = useGetRedirectLink();
  const { userData } = useAuthContext();

  return (
    <Layout>
      <Navbar>
        <NavbarBreadcrumb
          lastItemAction={false}
          items={[
            {
              text: 'Team',
              onClick: () => history.push(getRedirectLink(`/authentication/${userData.userId}/overview`)),
            },
          ]}
        />
      </Navbar>
      <TabComponent tabNames={['Overview']} tabObjects={[<AuthenticationDetail key="overview" />]} />
    </Layout>
  );
};

export default AuthenticationDetailPage;
