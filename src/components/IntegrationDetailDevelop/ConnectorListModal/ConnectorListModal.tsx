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
import ListComponent from '@components/IntegrationDetailDevelop/ListComponent';
import * as SC from './styles';

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
        <SC.ConnectorList>
          <SC.CardTitle>Connectors</SC.CardTitle>
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
                    <ListComponent
                      handleClick={handleLinkConnector}
                      key={connector.id}
                      // @ts-ignore
                      connector={connector}
                    />
                  );
                })}
            </div>
          )}
        </SC.ConnectorList>
      </Fade>
    </Modal>
  );
};

export default ConnectorListModal;
