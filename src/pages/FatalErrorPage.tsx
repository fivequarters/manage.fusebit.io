import React, { FC, ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '../components/common/Layout';
import FatalError from '../components/FatalError';
import Navbar from '../components/common/Navbar';
import NavbarBreadcrumb from '../components/common/NavbarBreadcrumb';
import { useGetRedirectLink } from '../hooks/useGetRedirectLink';

// TODO: Review if this is ever used.

const FataErrorPage: FC<{}> = (): ReactElement => {
  const history = useHistory();

  const { getRedirectLink } = useGetRedirectLink();
  return (
    <Layout>
      <Navbar>
        <NavbarBreadcrumb
          lastItemAction={false}
          items={[
            {
              text: 'Integrations',
              onClick: () => history.push(getRedirectLink('/integrations/overview')),
            },
          ]}
        />
      </Navbar>
      <FatalError />
    </Layout>
  );
};

export default FataErrorPage;
