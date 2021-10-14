import React, { FC, ReactElement } from 'react';
import Layout from '../components/Layout';
import Navbar from '../components/common/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';
import Overview from '../components/AuthenticationDetail/Overview';
import TabComponent from '../components/common/TabComponent';

const AuthenticationDetailPage: FC<{}> = (): ReactElement => {
  useTrackPage('Team User Details', 'Team');

  return (
    <Layout>
      <Navbar sectionName="Authentication" authentication authenticationLink />
      <TabComponent tabNames={['Overview']} tabObjects={[<Overview key="overview" />]} />
    </Layout>
  );
};

export default AuthenticationDetailPage;
