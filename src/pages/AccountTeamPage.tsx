import React, { FC, ReactElement } from 'react';
import { Container } from '@material-ui/core';
import Navbar from '../components/Navbar';
import { useTrackPage } from '../hooks/useTrackPage';
import Layout from '../components/Layout';
import Team from '../components/AccountPage/Team/Team';

const AccountSettingsPage: FC<{}> = (): ReactElement => {
  useTrackPage('Team Overview', 'Team');

  return (
    <Layout>
      <Navbar sectionName="Account" authenticationLink={true} authentication={true} />
      <Container maxWidth="lg">
        <Team />
      </Container>
    </Layout>
  );
};

export default AccountSettingsPage;
