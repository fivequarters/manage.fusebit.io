import { useHistory, useParams } from 'react-router-dom';
import NavbarBreadcrumb from '../NavbarBreadcrumb/NavbarBreadcrumb';
import Navbar from '../Navbar/Navbar';

const AccountNavbar: React.FC = () => {
  const history = useHistory();
  const { accountId } = useParams<{ accountId: string }>();

  return (
    <Navbar>
      <NavbarBreadcrumb
        lastItemAction={false}
        items={[
          {
            text: 'Account',
            onClick: () => history.push(`/account/${accountId}/settings`),
          },
        ]}
      />
    </Navbar>
  );
};

export default AccountNavbar;
