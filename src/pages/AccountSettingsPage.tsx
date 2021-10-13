import React, { FC, ReactElement } from 'react';
import { Container } from '@material-ui/core';
import Navbar from '../components/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';
import Settings from '../components/AccountPage/Settings';
import Layout from '../components/Layout';

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
