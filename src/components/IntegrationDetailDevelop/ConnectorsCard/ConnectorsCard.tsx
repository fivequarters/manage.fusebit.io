import { Box } from '@material-ui/core';
import { useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { useAccountConnectorsGetAll } from '../../../hooks/api/v2/account/connector/useGetAll';
import { ACCOUNT_INTEGRATIONS_GET_ONE } from '../../../hooks/api/v2/account/integration/useGetOne';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { ApiResponse } from '../../../hooks/useAxios';
import { useModal } from '../../../hooks/useModal';
import { Integration } from '../../../interfaces/integration';
import Button from '../../common/Button/Button';
import AddConnectorToIntegrationModal from '../AddConnectorToIntegrationModal';
import BaseCard from '../BaseCard';
import ConnectorItem from '../ConnectorItem';

interface Props {
  className?: string;
}

const ConnectorsCard: React.FC<Props> = ({ className }) => {
  const { userData } = useAuthContext();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [connectorModalOpen, , toggleConnectorModalOpen] = useModal();

  const { data: connectors, isLoading } = useAccountConnectorsGetAll({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  const integrationData = queryClient.getQueryData<ApiResponse<Integration>>([
    ACCOUNT_INTEGRATIONS_GET_ONE,
    { id, accountId: userData.accountId, subscriptionId: userData.subscriptionId },
  ]);

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
      <BaseCard
        className={className}
        title="Your Application"
        isLoading={isLoading}
        actions={
          <>
            <Button
              mode="add"
              style={{
                width: 160,
              }}
              onClick={toggleConnectorModalOpen}
              // disabled={usedConnectors.length >= 5}
            >
              Add new
            </Button>
            <Button
              mode="add"
              style={{
                width: 160,
              }}
              // onClick={handleConnectOpen}
              // disabled={backendClients.length >= 5}
            >
              Link existing
            </Button>
          </>
        }
      >
        <Box>
          {(usedConnectors || []).map((connector) => (
            <ConnectorItem key={connector.id} connector={connector} />
          ))}
        </Box>
      </BaseCard>
    </>
  );
};

export default ConnectorsCard;
