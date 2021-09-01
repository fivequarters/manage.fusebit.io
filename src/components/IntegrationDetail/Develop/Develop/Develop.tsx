import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { generateKeyPair } from '../../../../utils/crypto';
import * as SC from './styles';
import * as CSC from '../../../globalStyle';
import { Button, Modal, Backdrop, Fade } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import arrow from '../../../../assets/arrow-right-black.svg';
import Connect from './Connect';
import { useLoader } from '../../../../hooks/useLoader';
import { useError } from '../../../../hooks/useError';
import { useContext } from '../../../../hooks/useContext';
import { useAccountIntegrationUpdateIntegration } from '../../../../hooks/api/v2/account/integration/useUpdateOne';
import { useAccountIntegrationsGetOne } from '../../../../hooks/api/v2/account/integration/useGetOne';
import { useAccountConnectorsGetAll } from '../../../../hooks/api/v2/account/connector/useGetAll';
import { useAccountConnectorCreateConnector } from '../../../../hooks/api/v2/account/connector/useCreateOne';
import { useAccountUserCreateIssuer } from '../../../../hooks/api/v1/account/issuer/useCreateIssuer';
import { Operation } from '../../../../interfaces/operation';
import { Connector } from '../../../../interfaces/connector';
import { Integration, InnerConnector } from '../../../../interfaces/integration';
import Edit from './Edit';
import { useGetRedirectLink } from '../../../../hooks/useGetRedirectLink';
import FeedPicker from '../../../FeedPicker';
import ConnectorComponent from './ConnectorComponent';
import { Entity, Feed } from '../../../../interfaces/feed';
import { Data } from '../../../../interfaces/feedPicker';
import { useReplaceMustache } from '../../../../hooks/useReplaceMustache';
import { FinalConnector } from '../../../../interfaces/integrationDetailDevelop';
import { useState } from 'react';
import { useEffect } from 'react';

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
  const createConnector = useAccountConnectorCreateConnector<Operation>();
  const createIssuer = useAccountUserCreateIssuer<Operation>();
  const updateIntegration = useAccountIntegrationUpdateIntegration<Operation>();
  const { waitForOperations, createLoader, removeLoader } = useLoader();
  const { createError } = useError();
  const [editOpen, setEditOpen] = React.useState(false);
  const [connectOpen, setConnectOpen] = React.useState(false);
  const [connectorListOpen, setConnectorListOpen] = React.useState(false);
  const { getRedirectLink } = useGetRedirectLink();
  const [connectorPickerOpen, setConnectorPickerOpen] = React.useState(false);
  const { replaceMustache } = useReplaceMustache();
  const [loading, setLoading] = React.useState(false);

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
        skip: false,
        provider: '@fusebit-int/slack-provider',
        dependsOn: [],
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
      const parsedFeed = await replaceMustache(data, activeFeed);
      const commonTags = {
        'fusebit.feedType': 'connector',
        'fusebit.feedId': activeFeed.id,
      };
      await Promise.all([
        ...parsedFeed.configuration.entities.map(async (entity: Entity) => {
          if (entity.entityType === 'connector') {
            const obj = {
              data: entity.data,
              id: entity.id,
              tags: { ...commonTags, ...entity.tags },
              accountId: userData.accountId,
              subscriptionId: userData.subscriptionId,
            };
            const response = await createConnector.mutateAsync(obj);
            await waitForOperations([response.data.operationId]);

            const currentData = JSON.parse(JSON.stringify(integrationData?.data)) as Integration;
            const newData = currentData;
            const newConnector: InnerConnector = {
              name: entity.id,
              entityType: 'connector',
              entityId: entity.id,
              skip: false,
              provider: '@fusebit-int/slack-provider',
              path: '/api/configure',
              dependsOn: [],
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
        }),
      ]);
      reloadIntegration();
      reloadConnectors();
    } catch (e) {
      createError(e.message);
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

  const registerBackend = async () => {
    try {
      createLoader();
      const randomSuffix = nanoid();
      const issuerId = `iss-${randomSuffix}`;
      const keyId = `key-${randomSuffix}`;
      const keyPair = await generateKeyPair();
      const newIssuer = {
        issuerId,
        displayName: `Backend client issuer`,
        publicKeys: [
          {
            keyId,
            publicKey: keyPair.publicKeyPem,
          },
        ],
      };
      await createIssuer.mutateAsync(newIssuer);
    } catch (e) {
      createError(e.message);
    } finally {
      removeLoader();
    }
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
          <Edit open={editOpen} onClose={() => setEditOpen(false)} integration={integrationData?.data.id || ''} />
        </Fade>
      </Modal>
      <SC.Flex>
        <SC.CardSeparator />
        <SC.FlexDown>
          <SC.Card>
            <SC.CardTitle>Your Application</SC.CardTitle>
            <SC.CardButtonWrapper>
              <SC.CardConnectorButtonsWrapper>
                <Button
                  onClick={() => registerBackend()}
                  startIcon={<AddIcon />}
                  style={{ width: '160px', marginTop: '24px' }}
                  size="large"
                  variant="outlined"
                  color="primary"
                >
                  Add Backend
                </Button>
                <Button
                  onClick={() => setConnectOpen(true)}
                  startIcon={<AddIcon />}
                  style={{ width: '160px', marginTop: '24px', marginLeft: '5px' }}
                  size="large"
                  variant="outlined"
                  color="primary"
                >
                  Connect
                </Button>
              </SC.CardConnectorButtonsWrapper>
            </SC.CardButtonWrapper>
          </SC.Card>
          <SC.LinkWrapper>
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
              <SC.CardIntegration>
                <img src={arrow} alt="arrow" />
                {integrationData?.data.id}
              </SC.CardIntegration>
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
                      <ConnectorComponent
                        key={index}
                        connector={connector}
                        onConnectorDelete={(id: string) => handleConnectorDelete(id)}
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
