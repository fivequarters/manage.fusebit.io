import { useHistory } from 'react-router-dom';
import EntitiesMenu from '../EntitiesMenu/EntitiesMenu';
import NavbarBreadcrumb from '../NavbarBreadcrumb/NavbarBreadcrumb';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import useEntityBreadcrumb from '../../../hooks/useEntityBreadcrumb';
import Navbar from '../Navbar/Navbar';

const ConnectorsNavbar: React.FC = () => {
  const history = useHistory();
  const { getRedirectLink } = useGetRedirectLink();

  const { anchorEl, breadcrumbItems, handleCloseDrawer, handleCloseMenu, openDrawer } = useEntityBreadcrumb({
    initialText: 'Connectors',
    onClickInitialText: () => history.push(getRedirectLink('/connectors/overview')),
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

export default ConnectorsNavbar;
