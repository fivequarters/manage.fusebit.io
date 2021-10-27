import { useHistory, useParams } from 'react-router-dom';
import NavbarBreadcrumb from './NavbarBreadcrumb';
import NavBar from './NewNavbar';

const AccountNavbar: React.FC = () => {
  const history = useHistory();
  const { accountId } = useParams<{ accountId: string }>();

  return (
    <NavBar>
      <NavbarBreadcrumb
        lastItemAction={false}
        items={[
          {
            text: 'Account',
            onClick: () => history.push(`/account/${accountId}/settings`),
          },
        ]}
      />
    </NavBar>
  );
};

export default AccountNavbar;
