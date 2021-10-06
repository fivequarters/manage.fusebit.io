import { FC, ReactElement } from 'react';
import UsersTable from '../components/Authentication/AccountsTable';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import TabComponent from '../components/TabComponent';
import { useTrackPage } from '../hooks/useTrackPage';

const AuthenticationUsersPage: FC<{}> = (): ReactElement => {
  useTrackPage('Team Overview', 'Team');

  return (
    <Layout>
      <Navbar sectionName="Authentication" authenticationLink authentication />
      <TabComponent tabNames={['Users']} tabObjects={[<UsersTable key="usersTable" />]} />
    </Layout>
  );
};

export default AuthenticationUsersPage;
