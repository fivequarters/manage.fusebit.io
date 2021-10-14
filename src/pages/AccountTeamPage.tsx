import { FC, ReactElement } from 'react';
import Navbar from '../components/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';
import Layout from '../components/Layout';
import Drawer from '../components/common/Drawer';
import UsersTable from '../components/AccountPage/Team/UsersTable';

const AccountSettingsPage: FC<{}> = (): ReactElement => {
  useTrackPage('Team Overview', 'Team');

  return (
    <Layout>
      <Navbar sectionName="Account" authenticationLink={true} authentication={true} />
      <Drawer active="team">
        <UsersTable />
      </Drawer>
    </Layout>
  );
};

export default AccountSettingsPage;
