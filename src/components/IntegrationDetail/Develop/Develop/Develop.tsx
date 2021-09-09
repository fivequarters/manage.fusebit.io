import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import * as SC from './styles';
import * as CSC from '../../../globalStyle';
import { Button, Modal, Backdrop, Fade, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import arrow from '../../../../assets/arrow-right-black.svg';
import Connect from './Connect';
import { useLoader } from '../../../../hooks/useLoader';
import { useError } from '../../../../hooks/useError';
import { useContext } from '../../../../hooks/useContext';
import { useAccountIntegrationsGetOne } from '../../../../hooks/api/v2/account/integration/useGetOne';
import { useAccountConnectorsGetAll } from '../../../../hooks/api/v2/account/connector/useGetAll';
import { Connector } from '../../../../interfaces/connector';
import { Integration, InnerConnector } from '../../../../interfaces/integration';
import Edit from './Edit';
import { useGetRedirectLink } from '../../../../hooks/useGetRedirectLink';
import FeedPicker from '../../../FeedPicker';
import ListComponent from './ListComponent';
import { Entity, Feed } from '../../../../interfaces/feed';
import { Data } from '../../../../interfaces/feedPicker';
import { useReplaceMustache } from '../../../../hooks/useReplaceMustache';
import { FinalConnector } from '../../../../interfaces/integrationDetailDevelop';
import { useState } from 'react';
import { useEffect } from 'react';
import { useEntityApi } from '../../../../hooks/useEntityApi';
import { useBackendClient } from '../../../../hooks/useBackendClient';
import { BackendClient } from '../../../../interfaces/backendClient';

const Develop: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [integrationId, setIntegrationId] = useState(id);
  const { userData } = useContext();
  const { data: connectors, refetch: reloadConnectors } = useAccountConnectorsGetAll<{ items: Connector[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const { data: integrationData, refetch: reloadIntegration } = useAccountIntegrationsGetOne<Integration>({
    enabled: userData.token,
    id: integrationId,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const { createLoader, removeLoader } = useLoader();
  const { createError } = useError();
  const [editOpen, setEditOpen] = React.useState(false);
  const [connectOpen, setConnectOpen] = React.useState(false);
  const [connectorListOpen, setConnectorListOpen] = React.useState(false);
  const { getRedirectLink } = useGetRedirectLink();
  const [connectorPickerOpen, setConnectorPickerOpen] = React.useState(false);
  const { replaceMustache } = useReplaceMustache();
  const [loading, setLoading] = React.useState(false);
  const [backendClientsLoading, setBackendClientsLoading] = React.useState(true);
  const { toggleConnector, createEntity } = useEntityApi(true);
  const [keyIsCopied, setKeyIsCopied] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const { getBackendClientListener, registerBackend, removeBackendClientListener } = useBackendClient();
  const [backendClients, setBackendClients] = useState<BackendClient[]>([]);
  const [backendClientToken, setBackendClientToken] = useState('');
  const [backendClientId, setBackendClientId] = useState('');
  const [connectHover, setConnectHover] = useState(false);

  const getBackendClients = async () => {
    const backendClients = await getBackendClientListener();
    backendClients && setBackendClients(backendClients);
    setBackendClientsLoading(false);
  };

  React.useEffect(() => {
    if (userData.accountId) {
      getBackendClients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  React.useEffect(() => {
    const res = localStorage.getItem('refreshToken');
    if (res === 'true') {
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('refreshTokenUrl');
      setConnectOpen(true);
    }
    const unlisten = history.listen((location) => {
      setIntegrationId(location.pathname.split('/')[6]);
      setLoading(true);
    });

    return () => unlisten();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const checkAndReloadIntegration = async () => {
      if (userData.subscriptionId) {
        await reloadIntegration();
        setLoading(false);
      }
    };

    checkAndReloadIntegration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integrationId]);

  const _toggleConnector = async (connector: Entity, isAdding: boolean) => {
    createLoader();
    setConnectorListOpen(false);
    await toggleConnector(isAdding, connector, integrationData, () => {
      reloadIntegration();
      reloadConnectors();
    });
    removeLoader();
    setConnectorListOpen(false);
  };

  const handleListComponentDelete = async (connector: Entity) => {
    if (connector.isApplication) {
      setConnectOpen(false);
      await removeBackendClientListener(connector.id);
      await getBackendClients();
    } else {
      _toggleConnector(connector, false);
    }
  };

  const linkConnector = async (connector: Entity) => {
    _toggleConnector(connector, true);
  };

  const addNewConnector = async (activeFeed: Feed, data: Data) => {
    try {
      createLoader();
      const parsedFeed = await replaceMustache(data, activeFeed);
      const commonTags = {
        'fusebit.feedType': 'connector',
        'fusebit.feedId': activeFeed.id,
      };
      await Promise.all([
        ...parsedFeed.configuration.entities.map(async (entity: Entity) => {
          entity.tags = { ...commonTags, ...entity.tags };
          if (entity.entityType === 'connector') {
            await createEntity(entity, commonTags);
            await toggleConnector(true, entity, integrationData);
          }
        }),
      ]);
      reloadIntegration();
      reloadConnectors();
    } catch (e) {
      createError(e);
    } finally {
      removeLoader();
      setConnectorPickerOpen(false);
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
            ...innerConnector,
          };
          finalConnectorsList?.push(missingConnector);
        }
      });
    }

    return filteredConnectors || [];
  };

  const checkConnectorsToLink = () => {
    const connectorsFiltered = connectors?.data.items.filter((item: Connector) => {
      let returnItem = true;
      integrationData?.data.data.components.forEach((connector: InnerConnector) => {
        if (connector.entityId === item.id) {
          returnItem = false;
        }
      });
      return returnItem;
    });
    if (connectorsFiltered && connectorsFiltered?.length > 0) {
      return false;
    }
    return true;
  };

  const onConnectClose = async () => {
    if (keyIsCopied || showWarning) {
      await getBackendClients();
      setConnectOpen(false);
      setTimeout(() => {
        setShowWarning(false);
        setKeyIsCopied(false);
      }, 250);
    } else {
      setShowWarning(true);
    }
  };

  const handleConnectOpen = async () => {
    const backendClient = await registerBackend();
    setBackendClientToken(backendClient?.token || '');
    setBackendClientId(backendClient?.id || '');
    setConnectOpen(true);
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
        onClose={onConnectClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <Fade in={connectOpen}>
          <Connect
            onDelete={handleListComponentDelete}
            id={backendClientId}
            token={backendClientToken}
            showWarning={showWarning}
            setShowWarning={setShowWarning}
            keyIsCopied={keyIsCopied}
            setKeyIsCopied={setKeyIsCopied}
            open={connectOpen}
            onClose={onConnectClose}
          />
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
                    <ListComponent
                      onLinkConnectorClick={(connector: any) => linkConnector(connector)}
                      linkConnector={true}
                      key={index}
                      connector={connector}
                      onConnectorDelete={(connector: Entity) => handleListComponentDelete(connector)}
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
          <Edit open={editOpen} onClose={() => setEditOpen(false)} integration={integrationData?.data.id || ''} />
        </Fade>
      </Modal>
      <SC.Flex>
        <SC.CardSeparator />
        <SC.FlexDown>
          <SC.Card>
            <SC.CardTitle>Your Application</SC.CardTitle>
            {backendClients.length > 0 ? (
              backendClients.map((client: BackendClient) => (
                <ListComponent
                  connector={{ ...client, isApplication: true }}
                  onConnectorDelete={(connector: Entity) => handleListComponentDelete(connector)}
                />
              ))
            ) : !backendClientsLoading ? (
              <SC.NoApplicationsConfiguredWrapper>
                <SC.Flex>
                  <SC.DashedBox />
                  <SC.NoApplicationsConfiguredTitle>
                    No application connections configured
                  </SC.NoApplicationsConfiguredTitle>
                </SC.Flex>
                <SC.NoApplicationsConfiguredDescription>
                  Once you have tested your integration, click “Connect” to see how to call it from your application.
                </SC.NoApplicationsConfiguredDescription>
              </SC.NoApplicationsConfiguredWrapper>
            ) : (
              <CSC.LoaderContainer>
                <CSC.Spinner />
              </CSC.LoaderContainer>
            )}

            <SC.CardButtonWrapper>
              <Tooltip
                PopperProps={{
                  disablePortal: true,
                }}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                open={connectHover && backendClients.length >= 5}
                title="You cant add more than 5 applications"
                aria-label="You cant add more than 5 applications"
              >
                <div onMouseEnter={() => setConnectHover(true)} onMouseLeave={() => setConnectHover(false)}>
                  <Button
                    onClick={handleConnectOpen}
                    startIcon={<AddIcon />}
                    disabled={backendClients.length >= 5}
                    style={{ width: '200px' }}
                    size="large"
                    variant="outlined"
                    color="primary"
                  >
                    Connect
                  </Button>
                </div>
              </Tooltip>
            </SC.CardButtonWrapper>
          </SC.Card>
          <SC.LinkWrapper>
            <SC.LinkTitle>Learn More:</SC.LinkTitle>
            <SC.Link
              target="_blank"
              rel="noopener_noreferrer"
              href="https://developer.fusebit.io/docs/connecting-fusebit-with-your-application"
            >
              <SC.Bullet />
              Connecting Fusebit with Your Application
            </SC.Link>
          </SC.LinkWrapper>
        </SC.FlexDown>
        <SC.FlexDown>
          <SC.Card>
            <SC.CardTitle>Fusebit</SC.CardTitle>
            {integrationData?.data.id === undefined && !loading ? (
              <CSC.LoaderContainer>
                <CSC.Spinner />
              </CSC.LoaderContainer>
            ) : loading ? (
              <CSC.LoaderContainer>
                <CSC.Spinner />
              </CSC.LoaderContainer>
            ) : (
              <SC.CardIntegration>{integrationData?.data.id}</SC.CardIntegration>
            )}
            <SC.CardButtonWrapper>
              <Button
                onClick={() => setEditOpen(true)}
                style={{ width: '200px' }}
                size="large"
                variant="contained"
                color="primary"
              >
                Edit
              </Button>
            </SC.CardButtonWrapper>
          </SC.Card>
          <SC.LinkWrapper>
            <SC.LinkTitle>Learn More:</SC.LinkTitle>
            <SC.Link target="_blank" rel="noopener_noreferrer" href="https://developer.fusebit.io/docs/getting-started">
              <SC.Bullet />
              Getting Started
            </SC.Link>
            <SC.Link
              target="_blank"
              rel="noopener_noreferrer"
              href="https://developer.fusebit.io/docs/integration-programming-model"
            >
              <SC.Bullet />
              Integration Programming Model
            </SC.Link>
          </SC.LinkWrapper>
        </SC.FlexDown>
        <SC.FlexDown>
          <SC.Card>
            <SC.CardTitle>Connectors</SC.CardTitle>
            <SC.CardConnectorWrapper>
              {connectors?.data.items === undefined && !loading ? (
                <CSC.LoaderContainer>
                  <CSC.Spinner />
                </CSC.LoaderContainer>
              ) : loading ? (
                <CSC.LoaderContainer>
                  <CSC.Spinner />
                </CSC.LoaderContainer>
              ) : (
                filterConnectors().map((connector: FinalConnector, index: number) => {
                  if (index < 5) {
                    return (
                      <ListComponent
                        key={index}
                        connector={connector}
                        onConnectorDelete={(connector: Entity) => handleListComponentDelete(connector)}
                      />
                    );
                  }
                  return null;
                })
              )}
            </SC.CardConnectorWrapper>
            {integrationData?.data.data.components.length
              ? integrationData?.data.data.components.length >= 5 && (
                  <Link to={getRedirectLink('/connectors')}>
                    <SC.CardConnectorSeeMore href={getRedirectLink('/connectors')}>
                      See all
                      <img src={arrow} alt="see more" height="10" width="10" />
                    </SC.CardConnectorSeeMore>
                  </Link>
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
                disabled={checkConnectorsToLink()}
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
                style={{ width: '140px', marginTop: '10px' }}
                size="medium"
                variant="outlined"
                color="primary"
                disabled={checkConnectorsToLink()}
              >
                Link Existing
              </Button>
            </SC.CardConnectorButtonsWrapperMobile>
          </SC.Card>
          <SC.LinkWrapperMobile>
            <SC.LinkTitle>Learn More:</SC.LinkTitle>
            <SC.Link
              target="_blank"
              rel="noopener_noreferrer"
              href="https://developer.fusebit.io/docs/connecting-fusebit-with-your-application"
            >
              <SC.Bullet />
              Connecting Fusebit with Your Application
            </SC.Link>
            <SC.Link target="_blank" rel="noopener_noreferrer" href="https://developer.fusebit.io/docs/getting-started">
              <SC.Bullet />
              Getting Started
            </SC.Link>
            <SC.Link
              target="_blank"
              rel="noopener_noreferrer"
              href="https://developer.fusebit.io/docs/integration-programming-model"
            >
              <SC.Bullet />
              Integration Programming Model
            </SC.Link>
          </SC.LinkWrapperMobile>
        </SC.FlexDown>
      </SC.Flex>
    </SC.Background>
  );
};

export default Develop;
