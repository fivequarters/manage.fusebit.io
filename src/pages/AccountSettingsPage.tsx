import React, { FC, ReactElement } from 'react';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';
import Settings from '../components/AccountPage/Settings';
import { Container } from '@material-ui/core';

const AccountSettingsPage: FC<{}> = (): ReactElement => {
  useTrackPage('Settings Overview', 'Settings');

  return (
    <Layout>
      <Navbar sectionName="Account" authenticationLink={true} authentication={true} />
      <Container maxWidth="lg">
        <Settings />
      </Container>
    </Layout>
  );
};

export default AccountSettingsPage;
