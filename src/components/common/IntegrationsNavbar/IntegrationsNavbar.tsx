import EntitiesMenu from '../EntitiesMenu/EntitiesMenu';
import Navbar from '../Navbar';
import NavbarBreadcrumb from '../NavbarBreadcrumb';
import useEntityBreadcrumb from '../../../hooks/useEntityBreadcrumb';

const IntegrationsNavbar: React.FC = () => {
  const { anchorEl, breadcrumbItems, handleCloseDrawer, handleCloseMenu, openDrawer, isActive } = useEntityBreadcrumb({
    initialText: 'Integrations',
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

export default IntegrationsNavbar;
