import { useHistory } from 'react-router-dom';
import EntitiesMenu from '../EntitiesMenu/EntitiesMenu';
import Navbar from '../Navbar/Navbar';
import NavbarBreadcrumb from '../NavbarBreadcrumb/NavbarBreadcrumb';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import useEntityBreadcrumb from '../../../hooks/useEntityBreadcrumb';

const IntegrationsNavbar: React.FC = () => {
  const history = useHistory();
  const { getRedirectLink } = useGetRedirectLink();

  const { anchorEl, breadcrumbItems, handleCloseDrawer, handleCloseMenu, openDrawer } = useEntityBreadcrumb({
    initialText: 'Integrations',
    onClickInitialText: () => history.push(getRedirectLink('/integrations/overview')),
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
      <NavbarBreadcrumb items={breadcrumbItems} />
    </Navbar>
  );
};

export default IntegrationsNavbar;
