import { Backdrop, CircularProgress, Fade, Modal } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useAccountConnectorsGetAll } from '@hooks/api/v2/account/connector/useGetAll';
import { useAccountIntegrationsGetOne } from '@hooks/api/v2/account/integration/useGetOne';
import { useAuthContext } from '@hooks/useAuthContext';
import { useEntityApi } from '@hooks/useEntityApi';
import { useLoader } from '@hooks/useLoader';
import { Connector } from '@interfaces/connector';
import { Entity } from '@interfaces/feed';
import { InnerConnector, Integration } from '@interfaces/integration';
import ExistingConnectorItem from '@components/IntegrationDetailDevelop/ExistingConnectorItem';
import styled from 'styled-components';

const StyledCardTitle = styled.h4`
  font-size: 16px;
  line-height: 18px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 16px;
`;

const StyledConnectorList = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 0 32px 12px;
  border-radius: 8px;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  width: fit-content;
  transition: all 1s linear;
  > div {
    max-height: 350px;
    overflow: auto;
  }
`;

interface Props {
  open: boolean;
  onClose: () => void;
}

const ConnectorListModal = ({ onClose, open }: Props) => {
  const { userData } = useAuthContext();
  const { id } = useParams<{ id: string }>();
  const { addConnectorToIntegration } = useEntityApi();
  const { createLoader, removeLoader } = useLoader();

  const { data: connectors, isLoading: isLoadingConnectors } = useAccountConnectorsGetAll<{ items: Connector[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  const { data: integrationData, isLoading: isLoadingIntegration } = useAccountIntegrationsGetOne<Integration>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  const handleLinkConnector = async (connector: Entity) => {
    try {
      onClose();
      createLoader();

      await addConnectorToIntegration(connector, integrationData);
    } finally {
      removeLoader();
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <Fade in={open}>
        <StyledConnectorList>
          <StyledCardTitle>Connectors</StyledCardTitle>
          {isLoadingIntegration || isLoadingConnectors ? (
            <CircularProgress size={20} />
          ) : (
            <div>
              {connectors?.data.items
                .filter((item: Connector) => {
                  let returnItem = true;

                  integrationData?.data.data.components.forEach((connector: InnerConnector) => {
                    if (connector.entityId === item.id) {
                      returnItem = false;
                    }
                  });
                  return returnItem;
                })
                .map((connector) => {
                  return (
                    <ExistingConnectorItem handleClick={handleLinkConnector} key={connector.id} connector={connector} />
                  );
                })}
            </div>
          )}
        </StyledConnectorList>
      </Fade>
    </Modal>
  );
};

export default ConnectorListModal;
