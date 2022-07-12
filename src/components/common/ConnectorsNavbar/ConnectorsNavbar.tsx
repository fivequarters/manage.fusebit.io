import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import EntitiesMenu from '../EntitiesMenu/EntitiesMenu';
import NavbarBreadcrumb from '../NavbarBreadcrumb/NavbarBreadcrumb';
import useEntityBreadcrumb from '../../../hooks/useEntityBreadcrumb';
import Navbar from '../Navbar';

interface Props {
  dropdownOnly?: boolean;
}

const ConnectorsNavbar: React.FC<Props> = ({ dropdownOnly }) => {
  const { getRedirectLink } = useGetRedirectLink();
  const { anchorEl, breadcrumbItems, handleCloseDrawer, handleCloseMenu, openDrawer, isActive } = useEntityBreadcrumb({
    initialText: 'Connectors',
    href: !dropdownOnly ? getRedirectLink('/connectors/overview') : undefined,
    isConnector: true,
  });

  return (
    <Navbar>
      <EntitiesMenu
        desktop={{
          onClose: handleCloseMenu,
          anchorEl,
        }}
        mobile={{
          onClose: handleCloseDrawer,
          open: openDrawer,
        }}
      />
      <NavbarBreadcrumb items={breadcrumbItems} isArrowActive={isActive} />
    </Navbar>
  );
};

export default ConnectorsNavbar;
