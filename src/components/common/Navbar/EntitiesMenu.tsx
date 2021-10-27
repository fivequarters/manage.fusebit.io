import styled from 'styled-components';
import { Menu } from '@material-ui/core';
import { useAccountConnectorsGetAll } from '../../../hooks/api/v2/account/connector/useGetAll';
import { useAccountIntegrationsGetAll } from '../../../hooks/api/v2/account/integration/useGetAll';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import EntityMenuSection from './EntityMenuSection';

const StyledSectionDropdownMenu = styled.div`
  padding: 0px 32px 12px;
  width: 317px;

  @media only screen and (max-width: 880px) {
    width: 100%;
    padding: 24px;
  }
`;

interface Props {
  anchorEl?: any;
  onClose: () => void;
}

const EntitiesMenu = ({ anchorEl, onClose }: Props) => {
  const { getRedirectLink } = useGetRedirectLink();
  const { userData } = useAuthContext();

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

  return (
    <>
      <Menu
        style={{ top: '100px' }}
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={onClose}
      >
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
      </Menu>
    </>
  );
};

export default EntitiesMenu;
