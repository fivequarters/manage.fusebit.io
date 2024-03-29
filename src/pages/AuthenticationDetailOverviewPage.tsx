import React, { FC, ReactElement } from 'react';
import Layout from '@components/common/Layout';
import Navbar from '@components/common/Navbar';
import { useTrackPage } from '@hooks/useTrackPage';
import AuthenticationDetail from '@components/AuthenticationDetailOverview/Overview';
import TabComponent from '@components/common/TabComponent';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import { useAuthContext } from '@hooks/useAuthContext';
import NavbarBreadcrumb from '@components/common/NavbarBreadcrumb';
import useTitle from '@hooks/useTitle';

const AuthenticationDetailPage: FC<{}> = (): ReactElement => {
  useTrackPage('Team User Details', 'Team');
  useTitle('Account');
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
              href: getRedirectLink(`/authentication/${userData.userId}/overview`),
            },
          ]}
        />
      </Navbar>
      <TabComponent tabNames={['Overview']} tabObjects={[<AuthenticationDetail key="overview" />]} />
    </Layout>
  );
};

export default AuthenticationDetailPage;
