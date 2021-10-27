import { useHistory } from 'react-router-dom';
import EntitiesMenu from './EntitiesMenu';
import NavbarBreadcrumb from './NavbarBreadcrumb';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import useEntityBreadcrumb from '../../../hooks/useEntityBreadcrumb';
import NavBar from './NewNavbar';

const ConnectorsNavbar: React.FC = () => {
  const history = useHistory();
  const { getRedirectLink } = useGetRedirectLink();

  const { anchorEl, breadcrumbItems, handleClose } = useEntityBreadcrumb({
    initialText: 'Connectors',
    onClickInitialText: () => history.push(getRedirectLink('/connectors/overview')),
  });

  return (
    <NavBar>
      <EntitiesMenu anchorEl={anchorEl} onClose={handleClose} />
      <NavbarBreadcrumb items={breadcrumbItems} />
    </NavBar>
  );
};

export default ConnectorsNavbar;
