import EntitiesMenu from '../EntitiesMenu/EntitiesMenu';
import NavbarBreadcrumb from '../NavbarBreadcrumb/NavbarBreadcrumb';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import useEntityBreadcrumb from '../../../hooks/useEntityBreadcrumb';
import Navbar from '../Navbar';

const ConnectorsNavbar: React.FC = () => {
  const { getRedirectLink } = useGetRedirectLink();

  const { anchorEl, breadcrumbItems, handleCloseDrawer, handleCloseMenu, openDrawer, isActive } = useEntityBreadcrumb({
    initialText: 'Connectors',
    href: getRedirectLink('/connectors/overview'),
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
