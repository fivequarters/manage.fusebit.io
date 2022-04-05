import React, { useState, useEffect, useMemo, ReactElement } from 'react';
import ReactDOM from 'react-dom';
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
import ConfigureRunnerModal from '@components/IntegrationDetailDevelop/ConfigureRunnerModal';
import AddSnippetToIntegrationModal from '@components/IntegrationDetailDevelop/AddSnippetToIntegrationModal';
import { trackEventUnmemoized } from '@utils/analytics';
import ConfirmationPrompt from '@components/common/ConfirmationPrompt';
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
import { useError } from '@hooks/useError';
import { useCopy } from '@hooks/useCopy';
import { useGetIntegrationsFeed } from '@hooks/useGetIntegrationsFeed';
import useSampleApp from '@hooks/useSampleApp';
import { getIntegrationConfig } from '@utils/localStorage';
import MobileDrawer from '../MobileDrawer';
import useEditorEvents from '../FusebitEditor/useEditorEvents';
import { BUILDING_TEXT, BUILD_COMPLETED_TEXT } from '../FusebitEditor/constants';
import useProcessing from '../hooks/useProcessing';
import useSnippetsModal from './useSnippetsModal';
import NavCategoryTooltip from './NavCategoryTooltip';
import SidebarOptions from './SidebarOptions';
import { HEADER_HEIGHT } from './constants';
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
    padding: 0 20px;
    padding-bottom: 20px;
    height: calc(100vh - ${HEADER_HEIGHT});
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
        transform: translateY(${-HEADER_HEIGHT.split('px')[0]}px);
      }
    }

    .fusebit-editor-container {
      position: relative;
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
        padding: 20px;
        background-color: #f7faff;
        border-radius: 4px;
        width: 253px;
      }

      &-splitter {
        opacity: 0;
        width: 8px;
      }

      &-category {
        display: flex;
        align-items: center;
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
        margin-bottom: 6px;
        padding: 8px;
        border-radius: 4px;
        transition: all 0.25s linear, font-weight 0.1s linear;

        &:hover {
          background: var(--secondary-color);
          font-weight: 600;
        }
      }

      &-new-file {
        &:hover {
          background: none;
        }
      }

      &-icon {
        margin-right: 10px;

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
        background: var(--secondary-color);
        font-weight: 600;
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
  height: ${HEADER_HEIGHT};
  z-index: 10;
  padding: 32px 20px;
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

const StyledForkAndEditWrapper = styled.div`
  position: absolute;
  right: 48px;
  top: 50%;
  transform: translateY(-50%);
`;

const StyledFusebitEditorContainer = styled(Box)`
  position: relative;
`;

const StyledTitle = styled.h3`
  font-size: 16px;
  line-height: 18px;
  font-family: 'Poppins';
  color: var(--black);
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
  padding: 8px;
  color: #333333;
  cursor: pointer;
  transition: all 0.25s linear, font-weight 0.1s linear;
`;

const addNewIcon = `
    position: absolute;
    left: 8px;
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
  const connectorsFeed = useGetConnectorsFeed();
  const integrationsFeed = useGetIntegrationsFeed();
  const { userData, getTenantId } = useAuthContext();
  const [isMounted, setIsMounted] = useState(false);
  const [configureRunnerActive, setConfigureRunnerActive] = useState(false);
  const [unsavedWarning, setUnsavedWarning] = useState(false);
  const { createLoader, removeLoader } = useLoader();
  const theme = useTheme();
  const matchesMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const integrationData = useGetIntegrationFromCache();
  const {
    handleRun,
    handleLogin,
    isFindingInstall,
    setNeedsInitialization,
    setRunPending,
    isRunning,
    handleFork,
    forkEditFeedUrl,
    assumeHasConnectors,
    missingConnectorNames,
    loginFlowModalOpen,
    setLoginFlowModalOpen,
  } = useEditor({
    integrationData,
    isMounted,
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
  const { url: sampleAppUrl } = useSampleApp();

  const { isSaving, errorBuild, setErrorBuild } = useEditorEvents({
    isMounted,
    events: [EditorEvents.BuildStarted, EditorEvents.BuildFinished, EditorEvents.BuildError],
  });

  const { snippetsModalOpen, onSnippetsModalOpen, onSnippetsModalClose } = useSnippetsModal({
    formatSnippet,
    getProviderVersion,
    integrationId,
    setDirtyState,
  });

  useEffect(() => {
    if (errorBuild) {
      createError({ message: 'The build failed' });
      setErrorBuild('');
    }
  }, [errorBuild, createError, setErrorBuild]);

  useTitle(`${id} Editor`);
  const { processing } = useProcessing({
    onProcessingStarted: () => {
      setTimeout(() => {
        window.editor?.serverLogsEntry(
          JSON.stringify({
            msg: BUILDING_TEXT,
            level: 30,
          })
        );
      }, 1000);
    },
    onProcessingCompleted: () => {
      window.editor?.serverLogsEntry(
        JSON.stringify({
          msg: BUILD_COMPLETED_TEXT,
          level: 30,
        })
      );
    },
  });

  useEffect(() => {
    const createAddNewItemElement = (lastItem: Element) => {
      const addNew = document.createElement('div');
      addNew.setAttribute('id', 'addNewItem');
      addNew.setAttribute('style', addNewStyles);
      addNew.onmouseenter = () => {
        addNew.style.background = 'rgba(215, 229, 255, 0.4)';
        addNew.style.fontWeight = '600';
      };
      addNew.onmouseleave = () => {
        addNew.style.background = 'none';
        addNew.style.fontWeight = '500';
      };
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
      p.setAttribute('style', 'margin: 0; margin-left: 25px;');
      p.innerText = 'New File';
      addNew.appendChild(p);

      const icon = document.createElement('div');
      icon.setAttribute('style', addNewIcon);
      addNew.appendChild(icon);

      lastItem.parentNode?.insertBefore(addNew, lastItem.nextSibling);
    };

    const appendCategoryTooltip = (
      category: Element | null,
      element: {
        id: string;
        jsx: ReactElement;
      }
    ) => {
      if (category && !document.getElementById(element.id)) {
        const div = document.createElement('div');
        div.setAttribute('id', element.id);
        div.style.display = 'flex';
        category.appendChild(div);
        ReactDOM.render(element.jsx, document.getElementById(element.id));
      }
    };

    if (isMounted && !isLoading) {
      removeLoader();
      const items = document.getElementsByClassName('fusebit-nav-file');
      const lastItem = items?.[items.length - 1];
      const codeCategory = document.querySelectorAll('.fusebit-nav-category')?.[0];
      const settingsCategory = document.querySelectorAll('.fusebit-nav-category')?.[1];

      if (!document.getElementById('addNewItem')) {
        createAddNewItemElement(lastItem);
      }

      appendCategoryTooltip(codeCategory, {
        id: 'code',
        jsx: (
          <NavCategoryTooltip
            title="Code"
            description="All the files needed to run your Fusebit Integration as a microservice on our platform."
          />
        ),
      });

      appendCategoryTooltip(settingsCategory, {
        id: 'settings',
        jsx: (
          <NavCategoryTooltip
            title="Settings"
            description="Configuration logic, such as CRON scheduling, for your Integration."
          />
        ),
      });

      // Default categories event tracking
      const fileItems = document.querySelectorAll('.fusebit-nav-file');
      fileItems?.forEach((item) => {
        if (item.getAttribute('data-event-click') !== 'true') {
          const fileName = item.querySelector('span')?.innerText;
          item.addEventListener('click', () => {
            trackEventUnmemoized('Code Menu Item Clicked', 'Web Editor', {
              clickedOn: fileName,
            });
          });
          item.setAttribute('data-event-click', 'true');
        }
      });

      const configurationItem = document.querySelector('[data-type=configurationSettings]');
      if (configurationItem?.getAttribute('data-event-click') !== 'true') {
        configurationItem?.addEventListener('click', () => {
          trackEventUnmemoized('Settings Menu Item Clicked', 'Web Editor', {
            clickedOn: 'Settings',
          });
        });
        configurationItem?.setAttribute('data-event-click', 'true');
      }

      // Add new sidebar options
      if (!document.getElementById('sidebar-options')) {
        const nav = document.querySelector('.fusebit-nav');
        const div = document.createElement('div');
        div.setAttribute('id', 'sidebar-options');
        nav?.appendChild(div);
        ReactDOM.render(
          <SidebarOptions
            integrationData={integrationData?.data}
            sampleAppUrl={sampleAppUrl}
            integrationsFeed={integrationsFeed.data}
            connectorsFeed={connectorsFeed.data}
            onSnippetsModalOpen={onSnippetsModalOpen}
          />,
          document.getElementById('sidebar-options')
        );
      }
    } else {
      createLoader();
    }
  }, [
    isMounted,
    isLoading,
    createLoader,
    removeLoader,
    integrationsFeed,
    connectorsFeed,
    integrationData,
    sampleAppUrl,
    onSnippetsModalOpen,
  ]);

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
    trackEventUnmemoized('Save Button Clicked', 'Web Editor');
    await context?._server.saveFunction(context);
    await invalidateIntegration();
    setDirtyState(false);
    setNeedsInitialization(true);
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

  const loginFlowModalDescription = useMemo(() => {
    return (
      <>
        Before running the integration, you need to authorize access to{' '}
        {missingConnectorNames.length > 0
          ? missingConnectorNames.map((connectorName, index) => {
              const isLastConnector = missingConnectorNames.length - 1 === index;
              const isPenultimateConnector = missingConnectorNames.length - 2 === index;

              if (!isLastConnector) {
                return (
                  <>
                    <strong>{connectorName}</strong>
                    {!isPenultimateConnector ? ', ' : ' '}
                  </>
                );
              }

              return (
                <>
                  and <strong>{connectorName}</strong>.{' '}
                </>
              );
            })
          : 'the target systems. '}
      </>
    );
  }, [missingConnectorNames]);

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
      <AddSnippetToIntegrationModal
        open={snippetsModalOpen}
        onClose={onSnippetsModalClose}
        integrationData={integrationData}
      />
      <StyledEditorContainer ref={ref}>
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
                <StyledTitle>Edit {integrationId}</StyledTitle>
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
          {isMounted && matchesMobile && (
            <MobileDrawer
              processing={processing}
              open={isMounted}
              onClose={handleClose}
              handleRun={handleRun}
              isRunning={isRunning}
            />
          )}
        </StyledFusebitEditorContainer>
      </StyledEditorContainer>
    </Box>
  );
});

export default EditGui;
