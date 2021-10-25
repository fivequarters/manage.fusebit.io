import { FC, ReactElement } from 'react';
import Navbar from '../components/common/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';
import Settings from '../components/AccountSettings/SettingsForm';
import Layout from '../components/common/Layout';
import AccountLayout from '../components/common/AccountLayout';

const AccountSettingsPage: FC<{}> = (): ReactElement => {
  useTrackPage('Settings Overview', 'Settings');

  return (
    <Layout>
      <Navbar sectionName="Account" authenticationLink={true} authentication={true} />
      <AccountLayout active="settings">
        <Settings />
      </AccountLayout>
    </Layout>
  );
};

export default AccountSettingsPage;
