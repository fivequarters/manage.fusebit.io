/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Modal,
  Backdrop,
  Fade,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Tooltip,
  useMediaQuery,
  Box,
  CircularProgress,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import * as SC from './styles';
import * as CSC from '../../../globalStyle';
import arrow from '../../../../assets/arrow-right-black.svg';
import Connect from './Connect';
import { useLoader } from '../../../../hooks/useLoader';
import { useError } from '../../../../hooks/useError';
import { useContext } from '../../../../hooks/useContext';
import { useAccountIntegrationsGetOne } from '../../../../hooks/api/v2/account/integration/useGetOne';
import { useAccountConnectorsGetAll } from '../../../../hooks/api/v2/account/connector/useGetAll';
import { Connector } from '../../../../interfaces/connector';
import { Integration, InnerConnector } from '../../../../interfaces/integration';
import EditGui from './EditGui';
import { useGetRedirectLink } from '../../../../hooks/useGetRedirectLink';
import FeedPicker from '../../../FeedPicker';
import ListComponent from './ListComponent';
import { Entity, Feed } from '../../../../interfaces/feed';
import { Data } from '../../../../interfaces/feedPicker';
import { useReplaceMustache } from '../../../../hooks/useReplaceMustache';
import { FinalConnector } from '../../../../interfaces/integrationDetailDevelop';
import { useEntityApi } from '../../../../hooks/useEntityApi';
import { useBackendClient } from '../../../../hooks/useBackendClient';
import { BackendClient } from '../../../../interfaces/backendClient';
import EditCli from './EditCli';
import { trackEvent } from '../../../../utils/analytics';
import LineConnector from '../../../LineConnector';
import MobileDrawer from './MobileDrawer';
import useEditor from './EditGui/useEditor';

const { REACT_APP_ENABLE_ONLINE_EDITOR } = process.env;
const isOnlineEditorEnabled = REACT_APP_ENABLE_ONLINE_EDITOR === 'true';

// TODO: Split this component and refactor ternary logic

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
  const [editGuiOpen, setEditGuiOpen] = React.useState(false);
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
  const [backendClient, setBackendClient] = useState<BackendClient>();
  const [connectHover, setConnectHover] = useState(false);
  const [editCliOpen, setEditCliOpen] = React.useState(false);
  const isMobile = useMediaQuery('(max-width: 850px)');
  const areCardsCollapsing = useMediaQuery('(max-width: 1200px)');
  const { handleEdit, isEditing } = useEditor({ enableListener: false, onReadyToRun: () => setEditGuiOpen(true) });

  const getBackendClients = async () => {
    const _backendClients = await getBackendClientListener();
    if (_backendClients) {
      setBackendClients(_backendClients);
    }
    setBackendClientsLoading(false);
  };

  React.useEffect(() => {
    if (userData.accountId) {
      getBackendClients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const editOptions = [
    {
      buttonLabel: isEditing ? <CircularProgress size={20} /> : 'Edit',
      optionLabel: 'Edit in the in-browser editor',
      handle: () => {
        trackEvent('Develop Edit Web Button Clicked', 'Integration');
        handleEdit();
      },
      disabled: isEditing,
    },
    {
      buttonLabel: isOnlineEditorEnabled ? 'CLI' : 'Edit',
      optionLabel: 'Edit with your favorite editor',
      handle: (isOpen: boolean) => {
        trackEvent('Develop Edit CLI Button Clicked', 'Integration');
        setEditCliOpen(isOpen);
      },
    },
  ];
  const editOptionAnchor = React.useRef<HTMLDivElement>(null);
  const [editOption, setEditOption] = React.useState(isOnlineEditorEnabled ? 0 : 1);
  const [editOptionOpen, setEditOptionOpen] = React.useState(false);

  const handleCloseEditOptions = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (editOptionAnchor.current && editOptionAnchor.current.contains(event.target as HTMLElement)) {
      return;
    }

    setEditOptionOpen(false);
  };

  const handleEditOptionClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
    setEditOption(index);
    setEditOptionOpen(false);
  };

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

    const finalConnectorsList: FinalConnector[] | undefined = filteredConnectors;

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
    trackEvent('Develop Connect Button Clicked', 'Integration');
    const _backendClient = await registerBackend();
    setBackendClient(_backendClient);
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
            name={backendClient?.name || ''}
            id={backendClient?.id || ''}
            onChange={getBackendClients}
            token={backendClient?.token || ''}
            showWarning={showWarning}
            setShowWarning={setShowWarning}
            keyIsCopied={keyIsCopied}
            setKeyIsCopied={setKeyIsCopied}
            open={connectOpen}
            onClose={onConnectClose}
            integration={integrationData?.data}
          />
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={editCliOpen}
        onClose={() => setEditCliOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <Fade in={editCliOpen}>
          <EditCli
            open={editCliOpen}
            onClose={() => setEditCliOpen(false)}
            integrationId={integrationData?.data.id || ''}
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
                .map((connector: Connector) => {
                  return (
                    <ListComponent
                      onLinkConnectorClick={(_connector: any) => linkConnector(_connector)}
                      linkConnector
                      key={connector.id}
                      connector={connector}
                      onConnectorDelete={(_connector: Entity) => handleListComponentDelete(_connector)}
                    />
                  );
                })}
            </div>
          </SC.ConnectorList>
        </Fade>
      </Modal>
      {isMobile ? (
        <MobileDrawer open={editGuiOpen} onClose={() => setEditGuiOpen(false)} />
      ) : (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={editGuiOpen}
          disableEscapeKeyDown
          onClose={() => {
            setEditGuiOpen(false);
          }}
          closeAfterTransition
          BackdropComponent={Backdrop}
        >
          <EditGui
            onClose={() => {
              setEditGuiOpen(false);
            }}
            integrationId={integrationData?.data.id || ''}
          />
        </Modal>
      )}
      <SC.Flex>
        <SC.FlexDown>
          <SC.Card id="yourApplication">
            <SC.CardTitle>Your Application</SC.CardTitle>
            {backendClients.length > 0 ? (
              backendClients.map((client: BackendClient) => (
                <React.Fragment key={client.id}>
                  <ListComponent
                    id={client.id}
                    onChange={getBackendClients}
                    connector={{ ...client, isApplication: true }}
                    onConnectorDelete={(connector: Entity) => handleListComponentDelete(connector)}
                    integration={integrationData?.data}
                  />
                  {!areCardsCollapsing && (
                    <LineConnector start={client.id} startAnchor="right" end="fusebit" endAnchor="left" />
                  )}
                </React.Fragment>
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
                title="You can't add more than 5 applications"
                aria-label="You can't add more than 5 applications"
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
            {areCardsCollapsing && (
              <LineConnector start="yourApplication" startAnchor="bottom" end="fusebit" endAnchor="top" />
            )}
          </SC.Card>
          {!areCardsCollapsing && (
            <Box mt="auto">
              <SC.LinkTitle>Learn More:</SC.LinkTitle>
              <SC.Link
                target="_blank"
                rel="noopener_noreferrer"
                href="https://developer.fusebit.io/docs/connecting-fusebit-with-your-application"
              >
                <SC.Bullet />
                Connecting Fusebit with Your Application
              </SC.Link>
            </Box>
          )}
        </SC.FlexDown>
        <SC.FlexDown>
          <SC.FusebitCard
            id="fusebit"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            margin="68px 0"
            padding="32px"
          >
            <SC.FusebitLogo mb="32px" />
            {integrationData?.data.id === undefined && !loading ? (
              <CSC.LoaderContainer>
                <CSC.Spinner />
              </CSC.LoaderContainer>
            ) : loading ? (
              <CSC.LoaderContainer>
                <CSC.Spinner />
              </CSC.LoaderContainer>
            ) : (
              <SC.FusebitIntegration>{integrationData?.data.id}</SC.FusebitIntegration>
            )}
            <SC.CardButtonWrapper>
              <Button
                onClick={() => editOptions[editOption].handle(true)}
                style={{ width: '200px' }}
                size="large"
                variant="contained"
                color="primary"
                disabled={!!editOptions[editOption]?.disabled}
              >
                {editOptions[editOption].buttonLabel}
              </Button>

              {isOnlineEditorEnabled && (
                <Popper
                  open={editOptionOpen}
                  anchorEl={editOptionAnchor.current}
                  role={undefined}
                  transition
                  disablePortal
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleCloseEditOptions}>
                          <MenuList id="split-button-menu">
                            {editOptions.map(
                              (
                                option: {
                                  buttonLabel: any;
                                  optionLabel: any;
                                  handle: (isOpen: boolean) => void;
                                },
                                index: number
                              ) => (
                                <MenuItem
                                  key={option.buttonLabel}
                                  disabled={index === 2}
                                  selected={index === editOption}
                                  onClick={(event) => handleEditOptionClick(event, index)}
                                >
                                  {option.optionLabel}
                                </MenuItem>
                              )
                            )}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              )}
            </SC.CardButtonWrapper>
            {!areCardsCollapsing &&
              filterConnectors().map((connector: FinalConnector, index: number) => {
                if (index < 5) {
                  return (
                    <LineConnector
                      key={connector.id}
                      start="fusebit"
                      startAnchor="right"
                      end={connector.id}
                      endAnchor="left"
                    />
                  );
                }
                return null;
              })}
          </SC.FusebitCard>
          {!areCardsCollapsing && (
            <Box display="flex" flexDirection="column" mt="auto" mb="-31.5px">
              <SC.LinkTitle>Learn More:</SC.LinkTitle>
              <SC.Link
                target="_blank"
                rel="noopener_noreferrer"
                href="https://developer.fusebit.io/docs/getting-started"
              >
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
            </Box>
          )}
        </SC.FlexDown>
        <SC.FlexDown>
          <SC.Card id="connectors">
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
                        id={connector.id}
                        key={connector.id}
                        connector={connector}
                        onConnectorDelete={(_connector: Entity) => handleListComponentDelete(_connector)}
                      />
                    );
                  }
                  return null;
                })
              )}
            </SC.CardConnectorWrapper>
            {(integrationData?.data?.data?.components || []).length >= 5 && (
              <Link to={getRedirectLink('/connectors')}>
                <SC.CardConnectorSeeMore href={getRedirectLink('/connectors')}>
                  See all
                  <img src={arrow} alt="see more" height="10" width="10" />
                </SC.CardConnectorSeeMore>
              </Link>
            )}

            <SC.CardConnectorButtonsWrapper>
              <Button
                onClick={() => {
                  trackEvent('Develop Add New Button Clicked', 'Integration');
                  setConnectorPickerOpen(true);
                }}
                startIcon={<AddIcon />}
                style={{ width: '160px', marginTop: '24px' }}
                size="large"
                variant="outlined"
                color="primary"
              >
                Add New
              </Button>
              <Button
                onClick={() => {
                  trackEvent('Develop Link Existing Clicked', 'Integration');
                  setConnectorListOpen(true);
                }}
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
                onClick={() => {
                  trackEvent('Develop Add New Button Clicked', 'Integration');
                  setConnectorPickerOpen(true);
                }}
                startIcon={<AddIcon />}
                style={{ width: '135px', marginTop: '10px' }}
                size="medium"
                variant="outlined"
                color="primary"
              >
                Add New
              </Button>
              <Button
                onClick={() => {
                  trackEvent('Develop Link Existing Clicked', 'Integration');
                  setConnectorListOpen(true);
                }}
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
            {areCardsCollapsing && (
              <LineConnector start="fusebit" startAnchor="bottom" end="connectors" endAnchor="top" />
            )}
          </SC.Card>
          {areCardsCollapsing && (
            <Box display="flex" flexDirection="column">
              <SC.LinkTitle>Learn More:</SC.LinkTitle>
              <SC.Link
                target="_blank"
                rel="noopener_noreferrer"
                href="https://developer.fusebit.io/docs/connecting-fusebit-with-your-application"
              >
                <SC.Bullet />
                Connecting Fusebit with Your Application
              </SC.Link>
              <SC.Link
                target="_blank"
                rel="noopener_noreferrer"
                href="https://developer.fusebit.io/docs/getting-started"
              >
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
            </Box>
          )}
        </SC.FlexDown>
      </SC.Flex>
    </SC.Background>
  );
};

export default Develop;
