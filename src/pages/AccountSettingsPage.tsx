import { FC, ReactElement } from 'react';
import Navbar from '../components/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';
import Settings from '../components/AccountPage/Settings';
import Layout from '../components/Layout';
import Drawer from '../components/common/Drawer';

const AccountSettingsPage: FC<{}> = (): ReactElement => {
  useTrackPage('Settings Overview', 'Settings');

  return (
    <Layout>
      <Navbar sectionName="Account" authenticationLink={true} authentication={true} />
      <Drawer active="settings">
        <Settings />
      </Drawer>
    </Layout>
  );
};

export default AccountSettingsPage;
