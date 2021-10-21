import { Box, useMediaQuery, useTheme } from '@material-ui/core';
import { useMemo } from 'react';
import { useAccountConnectorsGetAll } from '../../../hooks/api/v2/account/connector/useGetAll';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useGetIntegrationFromCache } from '../../../hooks/useGetIntegrationFromCache';
import { useModal } from '../../../hooks/useModal';
import Button from '../../common/Button/Button';
import LineConnector from '../../common/LineConnector';
import AddConnectorToIntegrationModal from '../AddConnectorToIntegrationModal';
import BaseCard from '../BaseCard';
import ConnectorItem from '../ConnectorItem';
import ConnectorListModal from '../ConnectorListModal';
import { CARD_OVERLAPPING_MEDIA_QUERY } from '../constants';
import { INTEGRATION_CARD_ID } from '../IntegrationCard/IntegrationCard';

interface Props {
  className?: string;
}

const ConnectorsCard: React.FC<Props> = ({ className }) => {
  const { userData } = useAuthContext();
  const [connectorModalOpen, , toggleConnectorModalOpen] = useModal();
  const [linkExistingModalOpen, , toggleLinkExistingModalOpen] = useModal();
  const theme = useTheme();
  const matchesMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const matchesCardOverlapping = useMediaQuery(CARD_OVERLAPPING_MEDIA_QUERY);

  const { data: connectors, isLoading } = useAccountConnectorsGetAll({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  const integrationData = useGetIntegrationFromCache();

  const usedConnectors = useMemo(
    () =>
      (connectors?.data.items || []).filter((item) =>
        integrationData?.data.data.components.some((connector) => connector.entityId === item.id)
      ),
    [connectors, integrationData]
  );

  return (
    <>
      <AddConnectorToIntegrationModal
        open={connectorModalOpen}
        onClose={toggleConnectorModalOpen}
        integrationData={integrationData}
      />
      <ConnectorListModal open={linkExistingModalOpen} onClose={toggleLinkExistingModalOpen} />
      <BaseCard
        id="connectors"
        className={className}
        title="Connectors"
        isLoading={isLoading}
        actions={
          <>
            <Button
              mode="add"
              size={matchesMobile ? 'small' : 'large'}
              style={
                {
                  // width: 160,
                }
              }
              onClick={toggleConnectorModalOpen}
              // disabled={usedConnectors.length >= 5}
            >
              Add new
            </Button>
            <Button
              size={matchesMobile ? 'small' : 'large'}
              mode="add"
              style={
                {
                  // width: 160,
                }
              }
              onClick={toggleLinkExistingModalOpen}
              disabled={usedConnectors.length >= 5}
            >
              Link existing
            </Button>
          </>
        }
      >
        <Box>
          {(usedConnectors || []).map((connector) => (
            <ConnectorItem key={connector.id} connector={connector} integrationData={integrationData} />
          ))}
        </Box>
      </BaseCard>
      {matchesCardOverlapping && (
        <LineConnector start={INTEGRATION_CARD_ID} startAnchor="bottom" end="connectors" endAnchor="top" />
      )}
    </>
  );
};

export default ConnectorsCard;
