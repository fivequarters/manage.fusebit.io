import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import { useAuthContext } from '@hooks/useAuthContext';
import { useParams } from 'react-router-dom';
import { useAccountConnectorsGetOne } from '@hooks/api/v2/account/connector/useGetOne';
import { Connector } from '@interfaces/connector';
import { useGetFeedById } from '@hooks/useGetFeedById';
import EntitiesMenu from '../EntitiesMenu/EntitiesMenu';
import NavbarBreadcrumb from '../NavbarBreadcrumb/NavbarBreadcrumb';
import useEntityBreadcrumb from '../../../hooks/useEntityBreadcrumb';
import Navbar from '../Navbar';

interface Props {
  dropdownOnly?: boolean;
}

const ConnectorsNavbar: React.FC<Props> = ({ dropdownOnly }) => {
  const { getRedirectLink } = useGetRedirectLink();
  const { userData } = useAuthContext();
  const { id } = useParams<{ id: string }>();

  const { isLoading: isLoadingData, data: connectorData } = useAccountConnectorsGetOne<Connector>({
    enabled: userData.token && id,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  const { isLoading: isLoadingFeed, feed: feedEntity } = useGetFeedById({
    id: connectorData?.data.tags['fusebit.feedId'],
    type: connectorData?.data.tags['fusebit.feedType'],
  });

  const { anchorEl, breadcrumbItems, handleCloseDrawer, handleCloseMenu, openDrawer, isActive } = useEntityBreadcrumb({
    initialText: 'Connectors',
    href: !dropdownOnly ? getRedirectLink('/connectors/overview') : undefined,
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
      <NavbarBreadcrumb
        isLoadingIcon={isLoadingData || isLoadingFeed}
        items={breadcrumbItems}
        isArrowActive={isActive}
      />
    </Navbar>
  );
};

export default ConnectorsNavbar;
