import React from 'react';
import { useParams } from 'react-router-dom';
import * as SC from './styles';
import { Button, Modal, Backdrop, Fade } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import arrow from '../../../assets/arrow-right-black.svg';
import Connect from './Connect';
import { useLoader } from '../../../hooks/useLoader';
import { useError } from '../../../hooks/useError';
import { useContext } from '../../../hooks/useContext';
import { useAccountUserCreateToken } from '../../../hooks/api/v1/account/user/useCreateToken';
import { useAccountIntegrationUpdateIntegration } from '../../../hooks/api/v2/account/integration/useUpdateOne';
import { useAccountIntegrationsGetOne } from '../../../hooks/api/v2/account/integration/useGetOne';
import { useAccountConnectorsGetAll } from '../../../hooks/api/v2/account/connector/useGetAll';
import { useAccountConnectorCreateConnector } from '../../../hooks/api/v2/account/connector/useCreateOne';
import { Operation } from '../../../interfaces/operation';
import { Connector } from '../../../interfaces/connector';
import { Integration, InnerConnector } from '../../../interfaces/integration';
import Edit from './Edit';
import { FuseInitToken } from '../../../interfaces/fuseInitToken';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import FeedPicker from '../../FeedPicker';
import ConnectorComponent from './ConnectorComponent';
import { Entity, Feed } from '../../../interfaces/feed';
import { Data } from '../../../interfaces/feedPicker';
import { useReplaceMustache } from '../../../hooks/useReplaceMustache';
import { FinalConnector } from '../../../interfaces/integrationDetailDevelop';

const Develop: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useContext();
  const { data: connectors, refetch: reloadConnectors } = useAccountConnectorsGetAll<{ items: Connector[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const { data: integrationData, refetch: reloadIntegration } = useAccountIntegrationsGetOne<Integration>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const createConnector = useAccountConnectorCreateConnector<Operation>();
  const updateIntegration = useAccountIntegrationUpdateIntegration<Operation>();
  const { waitForOperations, createLoader, removeLoader } = useLoader();
  const { createError } = useError();
  const createToken = useAccountUserCreateToken<FuseInitToken>();
  const [editOpen, setEditOpen] = React.useState(false);
  const [editToken, setEditToken] = React.useState<string | FuseInitToken>();
  const [connectOpen, setConnectOpen] = React.useState(false);
  const [connectorListOpen, setConnectorListOpen] = React.useState(false);
  const { getRedirectLink } = useGetRedirectLink();
  const [connectorPickerOpen, setConnectorPickerOpen] = React.useState(false);
  const { replaceMustache } = useReplaceMustache();

  React.useEffect(() => {
    const res = localStorage.getItem('refreshToken');
    if (res === 'true') {
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('refreshTokenUrl');
      setConnectOpen(true);
    }
  }, []);

  const handleConnectorDelete = async (connectorId: string) => {
    try {
      createLoader();
      const data = JSON.parse(JSON.stringify(integrationData?.data)) as Integration;
      const filteredComponents = data.data.components.filter((connector: InnerConnector) => {
        let returnConnector = true;
        if (connector.entityId === connectorId) {
          returnConnector = false;
        }
        return returnConnector;
      });
      data.data.components = filteredComponents;
      const response2 = await updateIntegration.mutateAsync({
        accountId: userData.accountId,
        subscriptionId: userData.subscriptionId,
        integrationId: integrationData?.data.id,
        data: data,
      });
      await waitForOperations([response2.data.operationId]);
      reloadIntegration();
      reloadConnectors();
    } catch (e) {
      createError(e.message);
    } finally {
      removeLoader();
      setConnectorListOpen(false);
    }
  };

  const linkConnector = async (connectorId: string) => {
    try {
      createLoader();
      setConnectorListOpen(false);
      const data = JSON.parse(JSON.stringify(integrationData?.data)) as Integration;
      const newData = data;
      const newConnector: InnerConnector = {
        name: connectorId,
        entityType: 'connector',
        entityId: connectorId,
        skip: true,
        path: 'proident ut tempor in ut',
        dependsOn: [],
        package: '@fusebit-int/pkg-oauth-integration',
      };
      newData.data.components.push(newConnector);
      const response2 = await updateIntegration.mutateAsync({
        accountId: userData.accountId,
        subscriptionId: userData.subscriptionId,
        integrationId: integrationData?.data.id,
        data: newData,
      });
      await waitForOperations([response2.data.operationId]);
      reloadIntegration();
      reloadConnectors();
    } catch (e) {
      createError(e.message);
    } finally {
      removeLoader();
      setConnectorListOpen(false);
    }
  };

  const addNewConnector = async (activeFeed: Feed, data: Data) => {
    try {
      createLoader();
      let connectors: Entity[] = [];
      const parsedFeed = await replaceMustache(data, activeFeed);
      for (let i = 0; i < parsedFeed.configuration.entities.length; i++) {
        const entity: Entity = parsedFeed.configuration.entities[i];
        if (entity.entityType === 'connector') {
          connectors.push(entity);
        }
      }
      for (let i = 0; i < connectors.length; i++) {
        const response = await createConnector.mutateAsync({
          data: connectors[i].data,
          id: connectors[i].id,
          tags: connectors[i].tags,
          accountId: userData.accountId,
          subscriptionId: userData.subscriptionId,
        });
        await waitForOperations([response.data.operationId]);
        const currentData = JSON.parse(JSON.stringify(integrationData?.data)) as Integration;
        const newData = currentData;
        const newConnector: InnerConnector = {
          name: connectors[i].id,
          entityType: 'connector',
          entityId: connectors[i].id,
          skip: true,
          path: 'proident ut tempor in ut',
          dependsOn: [],
          package: '@fusebit-int/pkg-oauth-integration',
        };
        newData.data.components.push(newConnector);
        const response2 = await updateIntegration.mutateAsync({
          accountId: userData.accountId,
          subscriptionId: userData.subscriptionId,
          integrationId: integrationData?.data.id,
          data: newData,
        });
        await waitForOperations([response2.data.operationId]);
      }
      reloadIntegration();
      reloadConnectors();
    } catch (e) {
      createError(e.message);
    } finally {
      removeLoader();
      setConnectorPickerOpen(false);
    }
  };

  const handleEditOpen = async () => {
    if (!editToken) {
      try {
        createLoader();
        const data = {
          protocol: 'pki',
          profile: {
            subscription: userData.subscriptionId,
          },
        };
        const response = await createToken.mutateAsync({
          accountId: userData.accountId,
          userId: userData.userId,
          data: data,
        });
        setEditToken(response.data);
        setEditOpen(true);
        removeLoader();
      } catch (e) {
        createError(e.message);
      }
    } else {
      setEditOpen(true);
    }
  };

  const filterConnectors = () => {
    const filteredConnectors = connectors?.data.items.filter((item: Connector) => {
      let returnItem = false;
      integrationData?.data.data.components.forEach((connector: InnerConnector) => {
        if (connector.entityId === item.id) {
          returnItem = true;
        }
      });
      return returnItem;
    });

    let finalConnectorsList: FinalConnector[] | undefined = filteredConnectors;

    if (
      integrationData &&
      filteredConnectors &&
      integrationData?.data.data.components.length > filteredConnectors.length
    ) {
      integrationData?.data.data.components.forEach((innerConnector: InnerConnector) => {
        let foundInnerConnector = false;
        filteredConnectors.forEach((connector: Connector) => {
          if (connector.id === innerConnector.entityId) {
            foundInnerConnector = true;
          }
        });
        if (!foundInnerConnector) {
          const missingConnector: FinalConnector = {
            missing: true,
            id: innerConnector.entityId,
          };
          finalConnectorsList?.push(missingConnector);
        }
      });
    }

    return filteredConnectors || [];
  };

  return (
    <SC.Background>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={connectorPickerOpen}
        onClose={() => setConnectorPickerOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <Fade in={connectorPickerOpen}>
          <FeedPicker
            onSubmit={(activeIntegration: Feed, data: Data) => addNewConnector(activeIntegration, data)}
            open={connectorPickerOpen}
            onClose={() => setConnectorPickerOpen(false)}
          />
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={connectOpen}
        onClose={() => setConnectOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <Fade in={connectOpen}>
          <Connect open={connectOpen} onClose={() => setConnectOpen(false)} />
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={connectorListOpen}
        onClose={() => setConnectorListOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <Fade in={connectorListOpen}>
          <SC.ConnectorList>
            <SC.CardTitle>Connectors</SC.CardTitle>
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
                .map((connector: Connector, index: number) => {
                  return (
                    <ConnectorComponent
                      onLinkConnectorClick={(id: string) => linkConnector(id)}
                      linkConnector={true}
                      key={index}
                      connector={connector}
                      onConnectorDelete={(id: string) => handleConnectorDelete(id)}
                    />
                  );
                })}
            </div>
          </SC.ConnectorList>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={editOpen}
        onClose={() => setEditOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <Fade in={editOpen}>
          <Edit
            open={editOpen}
            onClose={() => setEditOpen(false)}
            integration={integrationData?.data.id || ''}
            token={editToken || ''}
          />
        </Fade>
      </Modal>
      <SC.Flex>
        <SC.CardSeparator />
        <SC.FlexDown>
          <SC.Card>
            <SC.CardTitle>Your Application</SC.CardTitle>
            <SC.CardButtonWrapper>
              <Button
                onClick={() => setConnectOpen(true)}
                startIcon={<AddIcon />}
                style={{ width: '200px' }}
                size="large"
                variant="outlined"
                color="primary"
              >
                Connect
              </Button>
            </SC.CardButtonWrapper>
          </SC.Card>
          <SC.Link
            target="_blank"
            rel="noopener_noreferrer"
            href="https://docs.fusebit.io/docs/connecting-fusebit-with-your-application"
          >
            <SC.Bullet />
            Connecting Fusebit with Your Application
          </SC.Link>
        </SC.FlexDown>
        <SC.FlexDown>
          <SC.Card>
            <SC.CardTitle>Fusebit</SC.CardTitle>
            <SC.CardIntegration>
              <img src={arrow} alt="arrow" />
              {integrationData?.data.id}
            </SC.CardIntegration>
            <SC.CardButtonWrapper>
              <Button
                onClick={handleEditOpen}
                style={{ width: '200px' }}
                size="large"
                variant="contained"
                color="primary"
              >
                Edit
              </Button>
            </SC.CardButtonWrapper>
          </SC.Card>
          <SC.Link target="_blank" rel="noopener_noreferrer" href="https://docs.fusebit.io/docs/getting-started">
            <SC.Bullet />
            Getting Started
          </SC.Link>
        </SC.FlexDown>
        <SC.FlexDown>
          <SC.Card>
            <SC.CardTitle>Connectors</SC.CardTitle>
            <SC.CardConnectorWrapper>
              {filterConnectors().map((connector: FinalConnector, index: number) => {
                if (index < 5) {
                  return (
                    <ConnectorComponent
                      key={index}
                      connector={connector}
                      onConnectorDelete={(id: string) => handleConnectorDelete(id)}
                    />
                  );
                }
                return null;
              })}
            </SC.CardConnectorWrapper>
            {integrationData?.data.data.components.length
              ? integrationData?.data.data.components.length >= 5 && (
                  <SC.CardConnectorSeeMore href={getRedirectLink('/connectors')}>
                    See all
                    <img src={arrow} alt="see more" height="10" width="10" />
                  </SC.CardConnectorSeeMore>
                )
              : null}

            <SC.CardConnectorButtonsWrapper>
              <Button
                onClick={() => setConnectorPickerOpen(true)}
                startIcon={<AddIcon />}
                style={{ width: '160px', marginTop: '24px' }}
                size="large"
                variant="outlined"
                color="primary"
              >
                Add New
              </Button>
              <Button
                onClick={() => setConnectorListOpen(true)}
                startIcon={<AddIcon />}
                style={{ width: '160px', marginTop: '24px' }}
                size="large"
                variant="outlined"
                color="primary"
              >
                Link Existing
              </Button>
            </SC.CardConnectorButtonsWrapper>

            <SC.CardConnectorButtonsWrapperMobile>
              <Button
                onClick={() => setConnectorPickerOpen(true)}
                startIcon={<AddIcon />}
                style={{ width: '135px', marginTop: '10px' }}
                size="medium"
                variant="outlined"
                color="primary"
              >
                Add New
              </Button>
              <Button
                onClick={() => setConnectorListOpen(true)}
                startIcon={<AddIcon />}
                style={{ width: '135px', marginTop: '10px' }}
                size="medium"
                variant="outlined"
                color="primary"
              >
                Link Existing
              </Button>
            </SC.CardConnectorButtonsWrapperMobile>
          </SC.Card>
        </SC.FlexDown>
      </SC.Flex>
    </SC.Background>
  );
};

export default Develop;
