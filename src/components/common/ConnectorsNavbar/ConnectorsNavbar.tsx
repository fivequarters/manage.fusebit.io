import EntitiesMenu from '../EntitiesMenu/EntitiesMenu';
import NavbarBreadcrumb from '../NavbarBreadcrumb/NavbarBreadcrumb';
import useEntityBreadcrumb from '../../../hooks/useEntityBreadcrumb';
import Navbar from '../Navbar';

const ConnectorsNavbar: React.FC = () => {
  const { anchorEl, breadcrumbItems, handleCloseDrawer, handleCloseMenu, openDrawer, isActive } = useEntityBreadcrumb({
    initialText: 'Connectors',
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
