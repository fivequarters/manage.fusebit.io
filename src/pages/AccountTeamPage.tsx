import { FC, ReactElement } from 'react';
import Navbar from '../components/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';
import Layout from '../components/Layout';
import AccountLayout from '../components/common/AccountLayout';
import UsersTable from '../components/AccountTeam/UsersTable';

const AccountSettingsPage: FC<{}> = (): ReactElement => {
  useTrackPage('Team Overview', 'Team');

  return (
    <Layout>
      <Navbar sectionName="Account" authenticationLink={true} authentication={true} />
      <AccountLayout active="team">
        <UsersTable />
      </AccountLayout>
    </Layout>
  );
};

export default AccountSettingsPage;
