import React, { FC, ReactElement } from 'react';
import Layout from '../components/Layout';
import FatalError from '../components/FatalError';
import Navbar from '../components/common/Navbar';

const LoggedOutErrorPage: FC<{}> = (): ReactElement => {
  return (
    <Layout>
      <Navbar sectionName="Integrations" integration />
      <FatalError />
    </Layout>
  );
};

export default LoggedOutErrorPage;
