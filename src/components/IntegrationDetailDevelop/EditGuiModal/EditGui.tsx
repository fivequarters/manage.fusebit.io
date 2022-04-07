import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, ButtonGroup, IconButton, useMediaQuery, useTheme } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Props, SaveStatus } from '@interfaces/edit';
import { useAuthContext } from '@hooks/useAuthContext';
import { useGetIntegrationFromCache } from '@hooks/useGetIntegrationFromCache';
import useSnippets from '@hooks/useSnippets';
import settings from '@assets/settings.svg';
import settingsPrimary from '@assets/settings-primary.svg';
import ConfigureRunnerModal from '@components/IntegrationDetailDevelop/ConfigureRunnerModal';
import AddSnippetToIntegrationModal from '@components/IntegrationDetailDevelop/AddSnippetToIntegrationModal';
import { trackEventMemoized, trackEventUnmemoized } from '@utils/analytics';
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
import { ReactComponent as ForkOutline } from '@assets/fork.svg';
import CloseIcon from '@material-ui/icons/Close';
import PlayArrowOutlined from '@material-ui/icons/PlayArrowOutlined';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import { useInvalidateIntegration } from '@hooks/useInvalidateIntegration';
import { useError } from '@hooks/useError';
import { useCopy } from '@hooks/useCopy';
import useSampleApp from '@hooks/useSampleApp';
import { getIntegrationConfig } from '@utils/localStorage';
import { useTrackPage } from '@hooks/useTrackPage';
import { useGetConnectorsFeed } from '@hooks/useGetConnectorsFeed';
import { InnerConnector } from '@interfaces/integration';
import MobileDrawer from '../MobileDrawer';
import useEditorEvents from '../FusebitEditor/useEditorEvents';
import { BUILDING_TEXT, BUILD_COMPLETED_TEXT } from '../FusebitEditor/constants';
import useProcessing from '../hooks/useProcessing';
import useSnippetsModal from './useSnippetsModal';
import { HEADER_HEIGHT } from './constants';
import useEditorLoader from './useEditorLoader';
import useCreateNewFile from './useCreateNewFile';
import useEditorAnalytics from './useEditorAnalytics';
import useCustomSidebar from './useCustomSidebar';
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

const EditGui = React.forwardRef<HTMLDivElement, Props>(({ onClose, integrationId, isLoading }, ref) => {
  const { id } = useParams<{ id: string }>();
  const connectorFeed = useGetConnectorsFeed();
  const { userData, getTenantId } = useAuthContext();
  const [isMounted, setIsMounted] = useState(false);
  const [configureRunnerActive, setConfigureRunnerActive] = useState(false);
  const [unsavedWarning, setUnsavedWarning] = useState(false);
  const [loginFlowModalOpen, setLoginFlowModalOpen] = useState(false);
  const theme = useTheme();
  const matchesMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
  const { url: sampleAppUrl } = useSampleApp();

  const { isSaving, errorBuild, setErrorBuild } = useEditorEvents({
    isMounted,
    events: [EditorEvents.BuildStarted, EditorEvents.BuildFinished, EditorEvents.BuildError],
  });

  const { snippetsModal, onSnippetsModalOpen, onSnippetsModalClose } = useSnippetsModal({
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

  const urlParams = new URLSearchParams(window.location.search);
  const forkEditFeedUrl = urlParams.get('forkEditFeedUrl');

  const pageName = forkEditFeedUrl ? 'Web Editor (Read-Only)' : 'Web Editor';
  const objectLocation = forkEditFeedUrl ? 'Web Editor (Read-Only)' : 'Web Editor';
  const additionalProperties = forkEditFeedUrl ? { Integration: integrationId, domain: 'API' } : undefined;
  useTrackPage(pageName, objectLocation, additionalProperties);
  if (forkEditFeedUrl) {
    trackEventMemoized('Share Redirect Execution', 'Share Function', additionalProperties);
  }

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

  const handleFork = () => {
    trackEventMemoized(
      'Fork Button Clicked',
      'Web Editor (Read-Only)',
      {
        Integration: integrationId,
      },
      () => {
        window.location.href = `/?forkFeedUrl=${forkEditFeedUrl}`;
      }
    );
  };
  const isEditorRunning = useMemo(() => isMounted && !isLoading, [isLoading, isMounted]);

  useEditorLoader({ isEditorRunning });
  useCreateNewFile({ isEditorRunning });
  useEditorAnalytics({ isEditorRunning });
  useCustomSidebar({ isEditorRunning, onSnippetsModalOpen, sampleAppUrl });

  const handleSaveAndRun = async () => {
    if (dirtyState) {
      const context = window.editor;
      const status: SaveStatus = await context?._server.saveFunction(context);
      trackEventUnmemoized('Save Button Clicked', 'Web Editor', {
        engagementType: 'Run Save',
      });
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
    trackEventUnmemoized('Save Button Clicked', 'Web Editor', {
      engagementType: 'Button Save',
    });
    await context?._server.saveFunction(context);
    await invalidateIntegration();
    setDirtyState(false);
    setNeedsInitialization(true);
  };

  const handleKeyUp = () => {
    setDirtyState(window.editor?.dirtyState);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((navigator.userAgent.match('Mac') ? e.metaKey : e.ctrlKey) && e.key === 's' && dirtyState) {
      e.preventDefault();
      trackEventUnmemoized('Save Button Clicked', 'Web Editor', {
        engagementType: 'Keyboard Save',
      });
    }
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
      <AddSnippetToIntegrationModal
        open={snippetsModal.isOpen}
        onClose={onSnippetsModalClose}
        integrationData={integrationData}
        defaultSnippet={snippetsModal.snippet}
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
          onKeyDown={handleKeyDown}
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
