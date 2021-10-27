import React, { FC, ReactElement } from 'react';
import Layout from '../components/common/Layout';
import FatalError from '../components/FatalError';
import Navbar from '../components/common/LegacyNavBar';

const FataErrorPage: FC<{}> = (): ReactElement => {
  return (
    <Layout>
      <Navbar sectionName="Integrations" integration />
      <FatalError />
    </Layout>
  );
};

export default FataErrorPage;
