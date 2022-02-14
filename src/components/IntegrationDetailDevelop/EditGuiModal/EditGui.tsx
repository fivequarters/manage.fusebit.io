import { Snippet, Feed, ConnectorEntity, EntityComponent } from '@interfaces/feed';
import { InnerConnector, IntegrationData } from '@interfaces/integration';
import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, ButtonGroup, IconButton, useMediaQuery, useTheme } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Props, SaveStatus } from '@interfaces/edit';
import { useAuthContext } from '@hooks/useAuthContext';
import { useLoader } from '@hooks/useLoader';
import { useGetConnectorsFeed } from '@hooks/useGetConnectorsFeed';
import { useGetIntegrationFromCache } from '@hooks/useGetIntegrationFromCache';
import useSnippets from '@hooks/useSnippets';
import settings from '@assets/settings.svg';
import settingsPrimary from '@assets/settings-primary.svg';
import question from '@assets/question.svg';
import logo from '@assets/logo.svg';
import ConfigureRunnerModal from '@components/IntegrationDetailDevelop/ConfigureRunnerModal';
import AddSnippetToIntegrationModal from '@components/IntegrationDetailDevelop/AddSnippetToIntegrationModal';
import { trackEvent } from '@utils/analytics';
import ConfirmationPrompt from '@components/common/ConfirmationPrompt';
import { useTrackPage } from '@hooks/useTrackPage';
import FusebitEditor from '@components/IntegrationDetailDevelop/FusebitEditor';
import useEditor from '@components/IntegrationDetailDevelop/FusebitEditor/useEditor';
import { useParams } from 'react-router-dom';
import useTitle from '@hooks/useTitle';
import styled from 'styled-components';
import file from '@assets/file.svg';
import cogs from '@assets/cogs.svg';
import clock from '@assets/clock.svg';
import playEditor from '@assets/play-editor.svg';
import add from '@assets/add.svg';
import { ReactComponent as ForkOutline } from '@assets/fork.svg';
import CloseIcon from '@material-ui/icons/Close';
import PlayArrowOutlined from '@material-ui/icons/PlayArrowOutlined';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import { useInvalidateIntegration } from '@hooks/useInvalidateIntegration';
import { CodeOutlined } from '@material-ui/icons';
import { useError } from '@hooks/useError';
import { useCopy } from '@hooks/useCopy';
import { getIntegrationConfig } from '@utils/localStorage';
import MobileDrawer from '../MobileDrawer';
import useEditorEvents from '../FusebitEditor/useEditorEvents';
import { logWithTime } from '../FusebitEditor/utils';
import { BUILDING_TEXT, BUILD_COMPLETED_TEXT } from '../FusebitEditor/constants';
import useProcessing from '../hooks/useProcessing';
import { EditGuiSampleApp } from './EditGuiSampleApp';
import { EditorEvents } from '~/enums/editor';

const StyledEditorContainer = styled.div`
  .fa {
    background-size: cover;
    background-repeat: no-repeat;

    &-file {
      background-image: url(${file});
    }

    &-cogs {
      background-image: url(${cogs});
    }

    &-clock {
      background-image: url(${clock});
    }

    &-play {
      background-image: url(${playEditor});
    }
  }

  .fusebit-code-action-add-btn {
    height: 1px;
    width: 1px;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }

  .fusebit-theme-light.fusebit-shell {
    position: relative;
    padding: 0 48px;
    padding-bottom: 60px;
    height: calc(100vh - 96px);
    background-color: #eff5ff;
  }

  .fusebit-action-container,
  .fusebit-status-container {
    display: none;
  }

  .fusebit-theme-light {
    .fusebit-main {
      height: 100%;
    }

    .fusebit-modal {
      border-radius: 8px;

      &-container {
        height: 100vh;
        transform: translateY(-96px);
      }
    }

    .fusebit-editor-container {
      padding-top: 20px;
      background-color: #ffffff;
      border-radius: 4px;
    }

    .fusebit-new-file-input {
      font-family: 'Poppins';
      font-size: 14px;
      line-height: 20px;
      border: 0;
      padding: 0;
      background: none;
      border-bottom: 1px solid var(--black);
    }

    .fusebit-nav {
      &-container {
        padding: 32px;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 4px;
        width: 253px;
      }

      &-splitter {
        opacity: 0;
        width: 8px;
      }

      &-category {
        font-family: 'Poppins';
        font-size: 16px;
        line-height: 18px;
        font-weight: 600;
        padding: 0;
        color: var(--black);
        margin-bottom: 16px;
      }

      &-file,
      &-new-file,
      &-item {
        font-family: 'Poppins';
        font-size: 14px;
        line-height: 20px;
        color: var(--black);
        margin-bottom: 12px;
        padding: 0;
        transition: all 0.1s linear;

        &:hover {
          background: none;
          font-weight: 700;
        }
      }

      &-icon {
        margin-right: 18px;

        > svg {
          width: 16px;
          height: 16px;
          margin-bottom: -1px;
          background-size: cover;
          background-repeat: no-repeat;
          > path {
            display: none;
          }
        }
      }

      &-item-selected {
        background: none;
        font-weight: 700;
      }
    }

    .fusebit-logs {
      &-splitter {
        opacity: 0;
        height: 8px;
      }

      &-container {
        font-family: courier;
        background-color: #ffffff;
        border-radius: 4px;
      }
    }
  }
`;

const StyledCloseWrapper = styled(IconButton)`
  top: 0;
  right: 0;
  color: var(--black);
  position: relative;
  z-index: 1;
  height: 30px;
  width: 30px;
  margin-left: auto;
  background-size: cover;
`;

const StyledCloseHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 96px;
  z-index: 10;
  padding: 32px 48px;
  background-color: #eff5ff;

  h3 {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: inline-block;
    margin: 0;
    font-size: 20px;
    line-height: 26px;
    font-weight: 600;
    color: var(--black);
  }
`;

const StyledActionsHelpWrapper = styled.div`
  position: absolute;
  right: 94px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
`;

const StyledForkAndEditWrapper = styled.div`
  position: absolute;
  right: 48px;
  top: 50%;
  transform: translateY(-50%);
`;

const StyledActionsHelpLink = styled.a`
  font-size: 14px;
  line-height: 20px;
  color: var(--black);
  text-decoration: underline;
  margin-right: 10px;
`;

const StyledActionsHelpImage = styled.img`
  height: 16px;
  width: 16px;

  &:hover {
    cursor: pointer;
  }
`;

const StyledFusebitEditorContainer = styled(Box)`
  position: relative;
`;

const StyledFusebitEditorLogo = styled.img`
  position: absolute;
  bottom: 24px;
  right: 48px;
  height: 20px;
  width: 80px;
  object-fit: contain;
`;

const StyledTitle = styled.h3`
  max-width: 600px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  @media only screen and (max-width: 1350px) {
    max-width: 400px;
  }

  @media only screen and (max-width: 1150px) {
    max-width: 225px;
  }
`;

const addNewStyles = `
  position: relative;
  font-family: 'Poppins';
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #333333;
  cursor: pointer;
`;

const addNewIcon = `
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 16px;
    width: 16px;
    background-image: url(${add});
    background-size: contain;
    background-repeat: no-repeat;
`;

// TODO: Implement useEditorEvents to listen dirty state events

const EditGui = React.forwardRef<HTMLDivElement, Props>(({ onClose, integrationId, isLoading }, ref) => {
  const { id } = useParams<{ id: string }>();
  const connectorFeed = useGetConnectorsFeed();
  const { userData, getTenantId } = useAuthContext();
  const [isMounted, setIsMounted] = useState(false);
  const [configureRunnerActive, setConfigureRunnerActive] = useState(false);
  const [unsavedWarning, setUnsavedWarning] = useState(false);
  const { createLoader, removeLoader } = useLoader();
  const [loginFlowModalOpen, setLoginFlowModalOpen] = useState(false);
  const theme = useTheme();
  const matchesMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [addSnippetModalOpen, setAddSnippetModalOpen] = useState(false);
  const [missingIdentities, setMissingIdentities] = useState<InnerConnector[] | undefined>(undefined);
  const integrationData = useGetIntegrationFromCache();
  const { handleRun, handleLogin, isFindingInstall, setNeedsInitialization, setRunPending, isRunning } = useEditor({
    integrationData,
    onReadyToLogin: () =>
      !missingIdentities || missingIdentities.length > 0 ? setLoginFlowModalOpen(true) : handleLogin(),
    onMissingIdentities: setMissingIdentities,
  });
  const [dirtyState, setDirtyState] = useState(false);
  const [enableGrafanaLogs] = useState<boolean>(() => {
    const result =
      window.location.search.includes('enableGrafanaLogs') || localStorage.getItem('enableGrafanaLogs') === 'true';
    localStorage.setItem('enableGrafanaLogs', `${!!result}`);
    return result;
  });

  const { invalidateIntegration } = useInvalidateIntegration();
  const { formatSnippet, getProviderVersion } = useSnippets();
  const { createError } = useError();
  const tenantId = getTenantId();
  const { handleCopy } = useCopy();

  const { isSaving, errorBuild, setErrorBuild } = useEditorEvents({
    isMounted,
    events: [EditorEvents.BuildStarted, EditorEvents.BuildFinished, EditorEvents.BuildError],
  });

  useEffect(() => {
    if (errorBuild) {
      createError({ message: 'The build failed' });
      setErrorBuild('');
    }
  }, [errorBuild, createError, setErrorBuild]);

  const urlParams = new URLSearchParams(window.location.search);
  const forkEditFeedUrl = urlParams.get('forkEditFeedUrl');

  const pageName = forkEditFeedUrl ? 'Share Redirect Execution' : 'Web Editor';
  const objectLocation = forkEditFeedUrl ? 'Share' : 'Web Editor';
  const additionalProperties = forkEditFeedUrl ? { Integration: integrationId, domain: 'API' } : undefined;
  useTrackPage(pageName, objectLocation, additionalProperties);
  useTitle(`${id} Editor`);
  const { processing } = useProcessing({
    onProcessingStarted: () => {
      const intervalID = setInterval(() => {
        const logs = document.querySelector('.fusebit-logs-content');
        if (logs?.innerHTML) {
          logs.innerHTML = `${logs.innerHTML}${logWithTime(BUILDING_TEXT).msg}\n`;
          clearInterval(intervalID);
        }
      }, 500);
    },
    onProcessingCompleted: () => {
      const logs = document.querySelector('.fusebit-logs-content');
      if (logs) {
        logs.innerHTML = `${logs.innerHTML}${logWithTime(BUILD_COMPLETED_TEXT).msg}\n`;
      }
    },
    enabled: !matchesMobile,
  });

  useEffect(() => {
    const createAddNewItemElement = (lastItem: Element) => {
      const addNew = document.createElement('div');
      addNew.setAttribute('id', 'addNewItem');
      addNew.setAttribute('style', addNewStyles);
      addNew.onclick = (e) => {
        e.stopPropagation();
        const el = document.querySelector('.fusebit-code-action-add-btn');
        if (el instanceof HTMLElement) {
          el?.click();
          document.getElementById('addNewItem')?.remove();
          const input = document.querySelector('.fusebit-nav-new-file');

          if (input) {
            createAddNewItemElement(input);
          }
        }
      };

      const p = document.createElement('p');
      p.setAttribute('style', 'margin: 0; margin-left: 32px;');
      p.innerText = 'New File';
      addNew.appendChild(p);

      const icon = document.createElement('div');
      icon.setAttribute('style', addNewIcon);
      addNew.appendChild(icon);

      lastItem.parentNode?.insertBefore(addNew, lastItem.nextSibling);
    };

    if (isMounted && !isLoading) {
      removeLoader();
      const items = document.getElementsByClassName('fusebit-nav-file');
      const lastItem = items?.[items.length - 1];
      if (!document.getElementById('addNewItem')) {
        createAddNewItemElement(lastItem);
      }
    } else {
      createLoader();
    }
  }, [isMounted, isLoading, createLoader, removeLoader]);

  const handleFork = () => {
    trackEvent(
      'Fork Button Clicked',
      'Web Editor',
      {
        Integration: integrationId,
      },
      () => {
        window.location.href = `/?forkFeedUrl=${forkEditFeedUrl}`;
      }
    );
  };

  const handleSaveAndRun = async () => {
    if (dirtyState) {
      const context = window.editor;
      const status: SaveStatus = await context?._server.saveFunction(context);
      if (status.status === 'completed') {
        await invalidateIntegration();
        setRunPending(true);
        setNeedsInitialization(true);
        setDirtyState(false);
      }
    } else {
      handleRun();
    }
  };

  const handleSave = async () => {
    const context = window.editor;
    trackEvent('Save Button Clicked', 'Web Editor');
    await context?._server.saveFunction(context);
    await invalidateIntegration();
    setDirtyState(false);
    setNeedsInitialization(true);
  };

  const handleAddSnippet = async () => {
    trackEvent('Snippets Button Clicked', 'Web Editor');
    setAddSnippetModalOpen(true);
  };

  const handleAddSnippetClose = (
    newConnector?: ConnectorEntity,
    existingConnector?: InnerConnector,
    feed?: Feed,
    snippet?: Snippet
  ) => {
    if (window.editor && feed && snippet) {
      trackEvent('Add Button Clicked', 'Add Snippet', {
        snippet: `${feed.id}-${snippet.id}`,
      });

      const addConnectorToConfig = (connector: ConnectorEntity) => {
        const connectorTemplate = (feed.configuration.components as EntityComponent[])[0];
        // Add newly created connector to integration's configuration
        const configuration = JSON.parse(window.editor.getConfigurationSettings()) as IntegrationData;
        configuration.components.push({
          ...connectorTemplate,
          name: connector.id,
          entityId: connector.id,
        });
        window.editor.setSettingsConfiguration(JSON.stringify(configuration));

        // Add provider dependency to package.json of the integration
        const providerVersion = getProviderVersion(feed);
        window.editor.selectFile('package.json');
        const content = JSON.parse(window.editor.getSelectedFileContent());
        content.dependencies[connectorTemplate.provider] = providerVersion;
        window.editor.setSelectedFileContent(JSON.stringify(content, null, 2));
      };

      const addSnippetCode = () => {
        // Add snippets at the end of integration.js
        window.editor.selectFile('integration.js');
        const newContent = formatSnippet(
          feed,
          snippet,
          integrationId,
          newConnector?.id || (existingConnector?.entityId as string),
          newConnector?.id || (existingConnector?.name as string)
        );
        const content = window.editor.getSelectedFileContent();
        window.editor.setSelectedFileContent(content + newContent);

        // Make sure the editor reloads the updated integration.js
        window.editor.selectedFileName = '';
        window.editor.selectFile('integration.js');

        // Scroll to the beginning of the snippet within integration.js in the editor
        const lineCountInNewContent = (newContent.match(/\n/g) || []).length;
        window.editor._monaco.revealLineNearTop(
          window.editor._monaco.getModel().getLineCount() - lineCountInNewContent
        );
        setDirtyState(true);
      };

      if (newConnector) {
        addConnectorToConfig(newConnector);
      }
      addSnippetCode();
    }
    setAddSnippetModalOpen(false);
  };

  const handleKeyUp = () => {
    setDirtyState(window.editor?.dirtyState);
  };

  const handleClose = () => {
    if (dirtyState) {
      setUnsavedWarning(true);
    } else {
      onClose();
    }
  };

  const assumeHasConnectors = !isMounted || !!window.editor?.specification.data.components.length;

  let missingConnectorNames: string[] = [];
  if (connectorFeed.data && integrationData) {
    const connectors =
      missingIdentities || integrationData.data.data.components.filter((c) => c.entityType === 'connector');
    missingConnectorNames = connectors
      .map((c) => connectorFeed.data.find((c1) => c1.configuration.components?.[0].provider === c.provider)?.name)
      .filter((name) => !!name) as string[];
  }

  const loginFlowModalDescription = (
    <>
      Before running the integration, you need to authorize access to{' '}
      {missingConnectorNames.length === 0 && 'the target systems. '}
      {missingConnectorNames.length === 1 && (
        <>
          <strong>{missingConnectorNames[0]}</strong>.{' '}
        </>
      )}
      {missingConnectorNames.length === 2 && (
        <>
          <strong>{missingConnectorNames[0]}</strong> and <strong>{missingConnectorNames[1]}</strong>.{' '}
        </>
      )}
      {missingConnectorNames.length > 2 &&
        missingConnectorNames.map((n, i) =>
          i < missingConnectorNames.length - 1 ? (
            <>
              <strong>{n}</strong>,{' '}
            </>
          ) : (
            <>
              and <strong>{n}</strong>.{' '}
            </>
          )
        )}
    </>
  );

  const buttonText = useMemo(() => {
    if (processing) {
      return (
        <>
          Building... <CircularProgress size={20} style={{ marginLeft: 10 }} />
        </>
      );
    }

    if (isFindingInstall) {
      return <CircularProgress size={20} />;
    }

    return 'Run';
  }, [processing, isFindingInstall]);

  const openConfigureModal = ({ shiftKey }: { shiftKey: boolean }) => {
    if (shiftKey) {
      handleCopy(
        `"fusebitEditor": { "runConfig": [ ${JSON.stringify(getIntegrationConfig(integrationId, tenantId).runner)} ] }`
      );
    } else {
      setConfigureRunnerActive(true);
    }
  };

  return (
    <Box>
      <ConfirmationPrompt
        open={unsavedWarning}
        setOpen={setUnsavedWarning}
        handleConfirmation={onClose}
        title="​Are you sure you want to discard unsaved changes?"
        description="You have some unsaved changes in your Integration. Closing this window will discard those changes."
        confirmationButtonText="Discard"
      />
      <ConfirmationPrompt
        open={loginFlowModalOpen}
        setOpen={setLoginFlowModalOpen}
        handleConfirmation={handleLogin}
        title="Start authorization"
        description={loginFlowModalDescription}
        confirmationButtonText="Start"
        hideCancelButton
      />
      <ConfigureRunnerModal open={configureRunnerActive} setOpen={setConfigureRunnerActive} />
      <StyledEditorContainer ref={ref}>
        <AddSnippetToIntegrationModal
          open={addSnippetModalOpen}
          onClose={handleAddSnippetClose}
          integrationData={integrationData}
        />
        {isMounted && !matchesMobile && (
          <StyledCloseHeader>
            {!forkEditFeedUrl && (
              <>
                <Button
                  style={{ marginRight: '16px' }}
                  startIcon={<SaveOutlined />}
                  onClick={handleSave}
                  size="small"
                  variant="outlined"
                  color="primary"
                  disabled={isSaving || !dirtyState || processing}
                >
                  Save
                </Button>
                <ButtonGroup variant={assumeHasConnectors ? 'contained' : 'outlined'} style={{ marginRight: '16px' }}>
                  <Button
                    startIcon={<PlayArrowOutlined />}
                    size="small"
                    variant={assumeHasConnectors ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={handleSaveAndRun}
                    disabled={isFindingInstall || isSaving || processing}
                  >
                    {buttonText}
                  </Button>
                  <Button
                    onClick={openConfigureModal}
                    size="small"
                    variant={assumeHasConnectors ? 'contained' : 'outlined'}
                    color="primary"
                  >
                    {assumeHasConnectors ? (
                      <img src={settings} alt="settings" height="16" width="16" />
                    ) : (
                      <img src={settingsPrimary} alt="settings" height="16" width="16" />
                    )}
                  </Button>
                </ButtonGroup>
                <Button
                  style={{ marginRight: '16px' }}
                  startIcon={<CodeOutlined />}
                  onClick={handleAddSnippet}
                  size="small"
                  variant={assumeHasConnectors ? 'outlined' : 'contained'}
                  color="primary"
                  disabled={isSaving || !isMounted}
                >
                  Snippets
                </Button>
                <StyledTitle>{integrationId}</StyledTitle>
                <StyledActionsHelpWrapper>
                  <EditGuiSampleApp />
                  <StyledActionsHelpLink
                    target="_blank"
                    href="https://developer.fusebit.io/docs/developing-locally"
                    onClick={() => {
                      trackEvent('Docs Developing Locally Link Clicked', 'Web Editor', {
                        Integration: integrationData?.data?.tags['fusebit.feedId'],
                      });
                    }}
                  >
                    Edit locally
                  </StyledActionsHelpLink>
                  <StyledActionsHelpImage src={question} alt="question" height="16" width="16" />
                </StyledActionsHelpWrapper>
                <StyledCloseWrapper onClick={handleClose}>
                  <CloseIcon fontSize="small" />
                </StyledCloseWrapper>
              </>
            )}
            {forkEditFeedUrl && (
              <>
                <Button
                  startIcon={<PlayArrowOutlined />}
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={handleSaveAndRun}
                  disabled={isFindingInstall || isSaving}
                  style={{ paddingLeft: '45px', paddingRight: '45px' }}
                >
                  {isFindingInstall ? <CircularProgress size={20} /> : 'Run'}
                </Button>
                <h3>{integrationId}</h3>
                <StyledForkAndEditWrapper>
                  <Button
                    startIcon={<ForkOutline height={16} width={16} />}
                    onClick={handleFork}
                    size="small"
                    variant="contained"
                    color="primary"
                    disabled={isSaving || !isMounted}
                    style={{ paddingLeft: '20px', paddingRight: '20px' }}
                  >
                    Fork and Edit
                  </Button>
                </StyledForkAndEditWrapper>
              </>
            )}
          </StyledCloseHeader>
        )}
        <StyledFusebitEditorContainer
          onKeyUp={handleKeyUp}
          position={matchesMobile && 'absolute'}
          left={matchesMobile && '-100vw'}
          bottom={matchesMobile && '-100vh'}
        >
          <FusebitEditor
            boundaryId="integration"
            functionId={integrationId}
            account={{
              accountId: userData.accountId,
              subscriptionId: userData.subscriptionId,
              baseUrl: process.env.REACT_APP_FUSEBIT_DEPLOYMENT,
              accessToken: userData.token,
            }}
            options={{
              entityType: 'integration',
              editor: {
                navigationPanel: { hideRunnerTool: true, hideScheduleSettings: true },
                features: {
                  enableGrafanaLogs,
                },
              },
            }}
            onLoaded={() => {
              setIsMounted(true);
            }}
          />
          {isMounted && !matchesMobile && (
            <StyledFusebitEditorLogo src={logo} alt="fusebit logo" height="20" width="80" />
          )}
          {isMounted && matchesMobile && (
            <MobileDrawer open={isMounted} onClose={handleClose} handleRun={handleRun} isRunning={isRunning} />
          )}
        </StyledFusebitEditorContainer>
      </StyledEditorContainer>
    </Box>
  );
});

export default EditGui;
