import React, { FC, ReactElement } from 'react';
import AuthenticationDetail from '../components/AuthenticationDetail/Overview/AuthenticationDetail';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';

const AuthenticationDetailPage: FC<{}> = (): ReactElement => {
  useTrackPage('Team User Details', 'Team');

  return (
    <Layout>
      <Navbar sectionName={'Authentication'} authentication={true} authenticationLink={true} />
      <AuthenticationDetail />
    </Layout>
  );
};

export default AuthenticationDetailPage;
