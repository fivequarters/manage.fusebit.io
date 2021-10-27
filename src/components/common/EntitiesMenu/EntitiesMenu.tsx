import styled from 'styled-components';
import { Menu, Drawer, useMediaQuery } from '@material-ui/core';
import { useAccountConnectorsGetAll } from '../../../hooks/api/v2/account/connector/useGetAll';
import { useAccountIntegrationsGetAll } from '../../../hooks/api/v2/account/integration/useGetAll';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
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
    anchorEl?: any;
    onClose: () => void;
  };
  mobile: {
    open: boolean;
    onClose: () => void;
  };
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

  const renderContent = () => {
    const onClose = isMobile ? mobile.onClose : desktop.onClose;

    return (
      <StyledSectionDropdownMenu>
        <EntityMenuSection
          onClose={onClose}
          items={integrations?.data?.items?.map((i) => ({
            id: i.id,
            to: getRedirectLink(`/integration/${i.id}/develop`),
          }))}
          linkTitleTo={getRedirectLink('/integrations/overview')}
          title="Integrations"
        />
        <EntityMenuSection
          onClose={onClose}
          items={connectors?.data?.items?.map((c) => ({
            id: c.id,
            to: getRedirectLink(`/connector/${c.id}/configure`),
          }))}
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
          style={{ top: '100px' }}
          id="simple-menu"
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
