import React, { FC, ReactElement } from 'react';
import Layout from '../components/common/Layout';
import Navbar from '../components/common/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';
import AuthenticationDetail from '../components/AuthenticationDetailOverview/Overview';
import TabComponent from '../components/common/TabComponent';

const AuthenticationDetailPage: FC<{}> = (): ReactElement => {
  useTrackPage('Team User Details', 'Team');

  return (
    <Layout>
      <Navbar sectionName="Team" team authenticationLink />
      <TabComponent tabNames={['Overview']} tabObjects={[<AuthenticationDetail key="overview" />]} />
    </Layout>
  );
};

export default AuthenticationDetailPage;
