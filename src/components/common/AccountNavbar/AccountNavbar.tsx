import { useParams } from 'react-router-dom';
import NavbarBreadcrumb from '../NavbarBreadcrumb/NavbarBreadcrumb';
import Navbar from '../Navbar';

const AccountNavbar: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();

  return (
    <Navbar>
      <NavbarBreadcrumb
        lastItemAction={false}
        items={[
          {
            text: 'Account',
            href: `/account/${accountId}/settings`,
          },
        ]}
      />
    </Navbar>
  );
};

export default AccountNavbar;
