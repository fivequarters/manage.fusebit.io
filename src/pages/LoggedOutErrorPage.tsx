import React, { FC, ReactElement } from 'react';
import Layout from '@components/common/Layout';
import LoggedOutError from '@components/LoggedOutError/LoggedOutError';
import useTitle from '@hooks/useTitle';

const LoggedOutErrorPage: FC<{}> = (): ReactElement => {
  useTitle('Logged Out');

  return (
    <Layout>
      <LoggedOutError />
    </Layout>
  );
};

export default LoggedOutErrorPage;
