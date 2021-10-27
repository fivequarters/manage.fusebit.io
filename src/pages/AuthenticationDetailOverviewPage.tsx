import { FC, ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '../components/common/Layout';
import NavBar from '../components/common/Navbar/NewNavbar';
import { useTrackPage } from '../hooks/useTrackPage';
import AuthenticationDetail from '../components/AuthenticationDetailOverview/Overview';
import TabComponent from '../components/common/TabComponent';
import NavbarBreadcrumb from '../components/common/Navbar/NavbarBreadcrumb';
import { useGetRedirectLink } from '../hooks/useGetRedirectLink';
import { useAuthContext } from '../hooks/useAuthContext';

const AuthenticationDetailPage: FC<{}> = (): ReactElement => {
  useTrackPage('Team User Details', 'Team');
  const history = useHistory();
  const { getRedirectLink } = useGetRedirectLink();
  const { userData } = useAuthContext();

  return (
    <Layout>
      <NavBar>
        <NavbarBreadcrumb
          lastItemAction={false}
          items={[
            {
              text: 'Team',
              onClick: () => history.push(getRedirectLink(`/authentication/${userData.userId}/overview`)),
            },
          ]}
        />
      </NavBar>
      <TabComponent tabNames={['Overview']} tabObjects={[<AuthenticationDetail key="overview" />]} />
    </Layout>
  );
};

export default AuthenticationDetailPage;
