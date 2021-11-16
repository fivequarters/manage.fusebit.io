import { FC, ReactElement } from 'react';
import { useTrackPage } from '@hooks/useTrackPage';
import Settings from '@components/AccountSettings/SettingsForm';
import Layout from '@components/common/Layout';
import AccountLayout from '@components/common/AccountLayout';
import useTitle from '@hooks/useTitle';

const AccountSettingsPage: FC<{}> = (): ReactElement => {
  useTrackPage('Settings Overview', 'Settings');
  useTitle('Account');

  return (
    <Layout>
      <AccountLayout active="settings">
        <Settings />
      </AccountLayout>
    </Layout>
  );
};

export default AccountSettingsPage;
