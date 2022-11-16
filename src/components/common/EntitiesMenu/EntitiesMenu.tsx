import { useMemo } from 'react';
import styled from 'styled-components';
import { Menu, Drawer, useMediaQuery } from '@material-ui/core';
import { useSortingPreferences } from '@hooks/useSortingPreferences';
import { Integration } from '@interfaces/integration';
import { Connector } from '@interfaces/connector';
import { useAccountConnectorsGetAll } from '@hooks/api/v2/account/connector/useGetAll';
import { useAccountIntegrationsGetAll } from '@hooks/api/v2/account/integration/useGetAll';
import { useAuthContext } from '@hooks/useAuthContext';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import EntityMenuSection from '../EntityMenuSection/EntityMenuSection';

const StyledSectionDropdownMenu = styled.div`
  padding: 0px 32px 12px;
  width: 317px;

  @media only screen and (max-width: 880px) {
    width: 100%;
    padding: 24px;
  }
`;

interface Props {
  desktop: {
    anchorEl: null | HTMLElement;
    onClose: () => void;
  };
  mobile: {
    open: boolean;
    onClose: () => void;
  };
}

interface Items {
  id: string;
  to: string;
  dateAdded: string;
  sortableCreatedAt: Date;
  sortableLastModified: Date;
}

const EntitiesMenu = ({ desktop, mobile }: Props) => {
  const { getRedirectLink } = useGetRedirectLink();
  const { userData } = useAuthContext();
  const isMobile = useMediaQuery('(max-width: 880px)');

  const { data: integrations } = useAccountIntegrationsGetAll({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const { data: connectors } = useAccountConnectorsGetAll({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  const { preferences, handleSorting } = useSortingPreferences();

  const entities = useMemo(() => {
    const integrationsSortingPreference = preferences?.integrations?.table;
    const connectorsSortingPreference = preferences?.connectors?.table;

    const getSortedEntities = (
      entitiesItems: Integration[] | Connector[] | undefined,
      sortingPreference: { order: string; orderBy: string },
      isIntegration: boolean
    ) => {
      const unsortedEntities = entitiesItems?.map((i) => ({
        id: i.id,
        dateAdded: i.dateAdded,
        sortableCreatedAt: new Date(i.dateAdded),
        sortableLastModified: new Date(i.dateModified),
        to: getRedirectLink(isIntegration ? `/integration/${i.id}/develop` : `/connector/${i.id}/configure`),
      }));

      const sortedEntities = unsortedEntities
        ?.sort((a, b) => {
          const orderBy = sortingPreference?.orderBy as keyof Items;

          return sortingPreference?.order === 'asc'
            ? handleSorting(a[orderBy], b[orderBy])
            : handleSorting(b[orderBy], a[orderBy]);
        })
        .slice(0, 5);

      return sortedEntities;
    };

    const sortedIntegrations = getSortedEntities(integrations?.data.items, integrationsSortingPreference, true);
    const sortedConnectors = getSortedEntities(connectors?.data.items, connectorsSortingPreference, false);

    return { sortedIntegrations, sortedConnectors };
  }, [integrations, connectors, getRedirectLink, handleSorting, preferences]);

  const renderContent = () => {
    const onClose = isMobile ? mobile.onClose : desktop.onClose;

    return (
      <StyledSectionDropdownMenu>
        <EntityMenuSection
          onClose={onClose}
          items={entities.sortedIntegrations}
          linkTitleTo={getRedirectLink('/integrations/overview')}
          title="Integrations"
        />
        <EntityMenuSection
          onClose={onClose}
          items={entities.sortedConnectors}
          linkTitleTo={getRedirectLink('/connectors/overview')}
          title="Connectors"
        />
      </StyledSectionDropdownMenu>
    );
  };

  return (
    <>
      {isMobile ? (
        <Drawer anchor="bottom" open={mobile.open} onClose={mobile.onClose}>
          {renderContent()}
        </Drawer>
      ) : (
        <Menu
          PaperProps={{
            style: {
              marginTop: '8px',
            },
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          getContentAnchorEl={null}
          anchorEl={desktop.anchorEl}
          keepMounted
          open={!!desktop.anchorEl}
          onClose={desktop.onClose}
        >
          {renderContent()}
        </Menu>
      )}
    </>
  );
};

export default EntitiesMenu;
