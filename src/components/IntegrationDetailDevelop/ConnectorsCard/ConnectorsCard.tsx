import { Box, useMediaQuery } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import differenceWith from 'lodash.differencewith';
import { useAccountConnectorsGetAll } from '@hooks/api/v2/account/connector/useGetAll';
import { useAuthContext } from '@hooks/useAuthContext';
import { useGetIntegrationFromCache } from '@hooks/useGetIntegrationFromCache';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import { useModal } from '@hooks/useModal';
import { FinalConnector } from '@interfaces/integrationDetailDevelop';
import Button from '@components/common/Button/Button';
import LineConnector from '@components/common/LineConnector';
import AddConnectorToIntegrationModal from '@components/IntegrationDetailDevelop/AddConnectorToIntegrationModal';
import BaseCard from '@components/IntegrationDetailDevelop/BaseCard';
import ConnectorItem from '@components/IntegrationDetailDevelop/ConnectorItem';
import ConnectorListModal from '@components/IntegrationDetailDevelop/ConnectorListModal';
import { CARD_OVERLAPPING_MEDIA_QUERY } from '@components/IntegrationDetailDevelop/constants';
import { INTEGRATION_CARD_ID } from '@components/IntegrationDetailDevelop/IntegrationCard/IntegrationCard';
import arrowIcon from '@assets/arrow-right-black.svg';
import useUpdateLineConnectors from '@hooks/useUpdateLineConnectors';
import { trackEvent } from '@utils/analytics';

interface Props {
  processing: boolean;
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

const ConnectorsCard: React.FC<Props> = ({ className, processing }) => {
  const { userData } = useAuthContext();
  const [connectorModalOpen, setConnectorModalOpen] = useModal();
  const [linkExistingModalOpen, setLinkExistingModalOpen] = useModal();
  const matchesMobile = useMediaQuery('(max-width: 450px)');
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
    setConnectorModalOpen(true);
  };

  const handleLinkExistingConnector = () => {
    trackEvent('Develop Link Existing Clicked', 'Integration');
    setLinkExistingModalOpen(true);
  };

  return (
    <>
      <AddConnectorToIntegrationModal
        open={connectorModalOpen}
        onClose={() => setConnectorModalOpen(false)}
        integrationData={integrationData}
      />
      <ConnectorListModal open={linkExistingModalOpen} onClose={() => setLinkExistingModalOpen(false)} />
      <BaseCard
        id="connectors"
        className={className}
        title="Connectors"
        isLoading={isLoading}
        actions={
          <>
            <Button
              mode="add"
              size={matchesMobile ? 'medium' : 'large'}
              fullWidth
              onClick={handleAddNewConnector}
              disabled={processing}
            >
              Add new
            </Button>
            <Button
              size={matchesMobile ? 'medium' : 'large'}
              mode="add"
              fullWidth
              onClick={handleLinkExistingConnector}
              disabled={isLinkExistingDisabled || processing}
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
