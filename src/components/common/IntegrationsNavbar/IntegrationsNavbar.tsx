import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import EntitiesMenu from '../EntitiesMenu/EntitiesMenu';
import Navbar from '../Navbar';
import NavbarBreadcrumb from '../NavbarBreadcrumb';
import useEntityBreadcrumb from '../../../hooks/useEntityBreadcrumb';

interface Props {
  dropdownOnly?: boolean;
}

const IntegrationsNavbar: React.FC<Props> = ({ dropdownOnly }) => {
  const { getRedirectLink } = useGetRedirectLink();
  const { anchorEl, breadcrumbItems, handleCloseDrawer, handleCloseMenu, openDrawer, isActive } = useEntityBreadcrumb({
    initialText: 'Integrations',
    href: !dropdownOnly ? getRedirectLink('/integrations/overview') : undefined,
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
