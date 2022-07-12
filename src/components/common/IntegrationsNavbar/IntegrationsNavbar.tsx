import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import useEntityBreadcrumb from '@hooks/useEntityBreadcrumb';
import { useAccountIntegrationsGetOne } from '@hooks/api/v2/account/integration/useGetOne';
import { Integration } from '@interfaces/integration';
import { useAuthContext } from '@hooks/useAuthContext';
import { useParams } from 'react-router-dom';
import { useGetFeedById } from '@hooks/useGetFeedById';
import EntitiesMenu from '../EntitiesMenu/EntitiesMenu';
import Navbar from '../Navbar';
import NavbarBreadcrumb from '../NavbarBreadcrumb';

interface Props {
  dropdownOnly?: boolean;
}

const IntegrationsNavbar: React.FC<Props> = ({ dropdownOnly }) => {
  const { getRedirectLink } = useGetRedirectLink();
  const { userData } = useAuthContext();
  const { id } = useParams<{ id: string }>();

  const { data: integrationData } = useAccountIntegrationsGetOne<Integration>({
    enabled: userData.token && id,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  const { feed: feedEntity } = useGetFeedById({
    id: integrationData?.data.tags['fusebit.feedId'] || '',
    type: integrationData?.data.tags['fusebit.feedType'] || 'integration',
  });

  const { anchorEl, breadcrumbItems, handleCloseDrawer, handleCloseMenu, openDrawer, isActive } = useEntityBreadcrumb({
    initialText: 'Integrations',
    href: !dropdownOnly ? getRedirectLink('/integrations/overview') : undefined,
    entityIcon: feedEntity?.smallIcon || '',
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
