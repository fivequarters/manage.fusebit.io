import { Box, useMediaQuery, useTheme } from '@material-ui/core';
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import differenceWith from 'lodash.differencewith';
import { useAccountConnectorsGetAll } from '../../../hooks/api/v2/account/connector/useGetAll';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useGetIntegrationFromCache } from '../../../hooks/useGetIntegrationFromCache';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import { useModal } from '../../../hooks/useModal';
import { FinalConnector } from '../../../interfaces/integrationDetailDevelop';
import Button from '../../common/Button/Button';
import LineConnector from '../../common/LineConnector';
import AddConnectorToIntegrationModal from '../AddConnectorToIntegrationModal';
import BaseCard from '../BaseCard';
import ConnectorItem from '../ConnectorItem';
import ConnectorListModal from '../ConnectorListModal';
import { CARD_OVERLAPPING_MEDIA_QUERY } from '../constants';
import { INTEGRATION_CARD_ID } from '../IntegrationCard/IntegrationCard';
import arrowIcon from '../../../assets/arrow-right-black.svg';
import useUpdateLineConnectors from '../../../hooks/useUpdateLineConnectors';
import { trackEvent } from '../../../utils/analytics';

interface Props {
  className?: string;
}

const StyledSeeMoreLink = styled.a`
  display: flex;
  align-items: center;
  font-size: 12px;
  line-height: 14px;
  font-weight: 300;
  color: var(--black);
  margin-left: auto;
  margin-top: 8px;
  text-decoration: none;

  > img {
    margin-left: 7.25px;
    transition: all 0.25s linear;
  }

  &:hover {
    cursor: pointer;
  }
`;

const ConnectorsCard: React.FC<Props> = ({ className }) => {
  const { userData } = useAuthContext();
  const [connectorModalOpen, , toggleConnectorModalOpen] = useModal();
  const [linkExistingModalOpen, , toggleLinkExistingModalOpen] = useModal();
  const theme = useTheme();
  const matchesMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const matchesCardOverlapping = useMediaQuery(CARD_OVERLAPPING_MEDIA_QUERY);
  const { getRedirectLink } = useGetRedirectLink();
  const updateLines = useUpdateLineConnectors();

  const { data: connectors, isLoading } = useAccountConnectorsGetAll({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  const integrationData = useGetIntegrationFromCache();

  const installedConnectors = useMemo(() => {
    return (integrationData?.data.data.components || []).map((integrationConnector) => {
      const existingConnector = connectors?.data.items.find((c) => c.id === integrationConnector.entityId);

      return (
        existingConnector || {
          ...integrationConnector,
          missing: true,
          id: integrationConnector.entityId,
        }
      );
    });
  }, [connectors, integrationData]);

  const isLinkExistingDisabled = useMemo(
    () =>
      differenceWith(
        connectors?.data.items || [],
        integrationData?.data.data.components || [],
        (a, b) => a.id === b.entityId
      ).length === 0,
    [connectors, integrationData]
  );

  useEffect(() => {
    updateLines();
  }, [connectors, updateLines]);

  const handleAddNewConnector = () => {
    trackEvent('Develop Add New Button Clicked', 'Integration');
    toggleConnectorModalOpen();
  };

  const handleLinkExistingConnector = () => {
    trackEvent('Develop Link Existing Clicked', 'Integration');
    toggleConnectorModalOpen();
  };

  return (
    <>
      <AddConnectorToIntegrationModal
        open={connectorModalOpen}
        onClose={toggleConnectorModalOpen}
        integrationData={integrationData}
      />
      <ConnectorListModal open={linkExistingModalOpen} onClose={handleLinkExistingConnector} />
      <BaseCard
        id="connectors"
        className={className}
        title="Connectors"
        isLoading={isLoading}
        actions={
          <>
            <Button mode="add" size={matchesMobile ? 'small' : 'large'} fullWidth onClick={handleAddNewConnector}>
              Add new
            </Button>
            <Button
              size={matchesMobile ? 'small' : 'large'}
              mode="add"
              fullWidth
              onClick={toggleLinkExistingModalOpen}
              disabled={isLinkExistingDisabled}
            >
              Link existing
            </Button>
          </>
        }
      >
        <Box display="flex" flexDirection="column">
          <Box>
            {installedConnectors.slice(0, 5).map((connector) => (
              <ConnectorItem
                key={connector.id}
                connector={connector as FinalConnector}
                integrationData={integrationData}
              />
            ))}
          </Box>
          {installedConnectors.length > 5 && (
            <Link to={getRedirectLink('/connectors')}>
              <StyledSeeMoreLink href={getRedirectLink('/connectors')}>
                See all
                <img src={arrowIcon} alt="see more" height="10" width="10" />
              </StyledSeeMoreLink>
            </Link>
          )}
        </Box>
      </BaseCard>
      {matchesCardOverlapping && (
        <LineConnector start={INTEGRATION_CARD_ID} startAnchor="bottom" end="connectors" endAnchor="top" />
      )}
    </>
  );
};

export default ConnectorsCard;
