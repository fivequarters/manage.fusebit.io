import { FC, ReactElement } from 'react';
import { useTrackPage } from '@hooks/useTrackPage';
import Layout from '@components/common/Layout';
import AccountLayout from '@components/common/AccountLayout';
import UsersTable from '@components/AccountTeam/UsersTable';
import useTitle from '@hooks/useTitle';

const AccountSettingsPage: FC<{}> = (): ReactElement => {
  useTrackPage('Team Overview', 'Team');
  useTitle('Account');

  return (
    <Layout>
      <AccountLayout active="team">
        <UsersTable />
      </AccountLayout>
    </Layout>
  );
};

export default AccountSettingsPage;
