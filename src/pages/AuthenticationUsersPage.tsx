import React, { FC, ReactElement } from 'react';
import AuthenticationUsers from '../components/Authentication/Users/AuthenticationUsers';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';

const AuthenticationUsersPage: FC<{}> = (): ReactElement => {
  return (
    <Layout>
      <Navbar sectionName="Authentication" authenticationLink={true} authentication={true} />
      <AuthenticationUsers />
    </Layout>
  );
};

export default AuthenticationUsersPage;
