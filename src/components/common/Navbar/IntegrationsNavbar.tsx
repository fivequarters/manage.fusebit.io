import { useHistory } from 'react-router-dom';
import EntitiesMenu from './EntitiesMenu';
import NavBar from './NewNavbar';
import NavbarBreadcrumb from './NavbarBreadcrumb';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import useEntityBreadcrumb from '../../../hooks/useEntityBreadcrumb';

const IntegrationsNavbar: React.FC = () => {
  const history = useHistory();
  const { getRedirectLink } = useGetRedirectLink();

  const { anchorEl, breadcrumbItems, handleClose } = useEntityBreadcrumb({
    initialText: 'Integrations',
    onClickInitialText: () => history.push(getRedirectLink('/integrations/overview')),
  });

  return (
    <NavBar>
      <EntitiesMenu anchorEl={anchorEl} onClose={handleClose} />
      <NavbarBreadcrumb items={breadcrumbItems} />
    </NavBar>
  );
};

export default IntegrationsNavbar;
