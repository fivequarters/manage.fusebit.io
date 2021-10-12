import React, { FC, ReactElement } from 'react';
import AuthenticationUsers from '../components/Authentication/Users/AuthenticationUsers';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';

const AuthenticationUsersPage: FC<{}> = (): ReactElement => {
  useTrackPage('Team Overview', 'Team');

  return (
    <Layout>
      <Navbar sectionName="Authentication" authenticationLink authentication />
      <AuthenticationUsers />
    </Layout>
  );
};

export default AuthenticationUsersPage;
