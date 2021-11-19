import React, { useState, useEffect } from 'react';
import { Box, Button, ButtonGroup, IconButton } from '@material-ui/core';
import { SaveOutlined, PlayArrowOutlined } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Props, SaveStatus } from '@interfaces/edit';
import { useAuthContext } from '@hooks/useAuthContext';
import { useLoader } from '@hooks/useLoader';
import settings from '@assets/settings.svg';
import question from '@assets/question.svg';
import logo from '@assets/logo.svg';
import ConfigureRunnerModal from '@components/IntegrationDetailDevelop/ConfigureRunnerModal';
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
import CloseIcon from '@material-ui/icons/Close';
import { useError } from '@hooks/useError';

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

const StyledFusebitEditorContainer = styled.div`
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

const EditGui = React.forwardRef<HTMLDivElement, Props>(({ onClose, integrationId }, ref) => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useAuthContext();
  const [isMounted, setIsMounted] = useState(false);
  const [configureRunnerActive, setConfigureRunnerActive] = useState(false);
  const [unsavedWarning, setUnsavedWarning] = useState(false);
  const { createLoader, removeLoader } = useLoader();
  const [loginFlowModalOpen, setLoginFlowModalOpen] = useState(false);
  const { handleRun, handleLogin, isFindingInstall, isSaving } = useEditor({
    onReadyToLogin: () => setLoginFlowModalOpen(true),
    isMounted,
  });
  const [dirtyState, setDirtyState] = useState(false);
  const { createError } = useError();

  useTrackPage('Web Editor', 'Web Editor');
  useTitle(`${id} Editor`);

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

    if (isMounted) {
      removeLoader();
      const items = document.getElementsByClassName('fusebit-nav-file');
      const lastItem = items?.[items.length - 1];
      if (!document.getElementById('addNewItem')) {
        createAddNewItemElement(lastItem);
      }
    } else {
      createLoader();
    }
  }, [isMounted, createLoader, removeLoader]);

  useEffect(() => {}, []);

  // TODO: Implement events from the editor to know its state
  const handleSaveAndRun = async () => {
    try {
      if (dirtyState) {
        const context = window.editor;
        const status: SaveStatus = await context?._server.saveFunction(context);
        if (status.status === 'completed') {
          setDirtyState(false);
          handleRun();
        }
      } else {
        handleRun();
      }
    } catch (e) {
      createError(e);
    }
  };

  const handleSave = async () => {
    const context = window.editor;
    trackEvent('Save Button Clicked', 'Web Editor');
    await context?._server.saveFunction(context);
    setDirtyState(false);
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

  return (
    <Box>
      <ConfirmationPrompt
        open={unsavedWarning}
        setOpen={setUnsavedWarning}
        handleConfirmation={onClose}
        title="​Are you sure you want to discard unsaved changes?"
        description="You have made some unsaved changes to your Integration. Closing this window will discard those changes."
        confirmationButtonText="Discard"
      />
      <ConfirmationPrompt
        open={loginFlowModalOpen}
        setOpen={setLoginFlowModalOpen}
        handleConfirmation={handleLogin}
        title="Start login flow?"
        description="The integration needs to know the Identity of the user on whose behalf to execute. For development purposes, please log in as your own user."
        confirmationButtonText="Start"
        hideCancelButton
      />
      <ConfigureRunnerModal open={configureRunnerActive} setOpen={setConfigureRunnerActive} />
      <StyledEditorContainer ref={ref}>
        {isMounted && (
          <StyledCloseHeader>
            <Button
              style={{ marginRight: '16px' }}
              startIcon={<SaveOutlined />}
              onClick={handleSave}
              size="small"
              variant="outlined"
              color="primary"
              disabled={isSaving || !dirtyState}
            >
              Save
            </Button>
            <ButtonGroup variant="contained">
              <Button
                startIcon={<PlayArrowOutlined />}
                size="small"
                variant="contained"
                color="primary"
                onClick={handleSaveAndRun}
                disabled={isFindingInstall || isSaving}
              >
                {isFindingInstall ? <CircularProgress size={20} /> : 'Run'}
              </Button>
              <Button onClick={() => setConfigureRunnerActive(true)} size="small" variant="contained" color="primary">
                <img src={settings} alt="settings" height="16" width="16" />
              </Button>
            </ButtonGroup>
            <h3>{integrationId}</h3>
            <StyledActionsHelpWrapper>
              <StyledActionsHelpLink target="_blank" href="https://developer.fusebit.io/docs/developing-locally">
                Edit locally
              </StyledActionsHelpLink>
              <StyledActionsHelpImage src={question} alt="question" height="16" width="16" />
            </StyledActionsHelpWrapper>
            <StyledCloseWrapper onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </StyledCloseWrapper>
          </StyledCloseHeader>
        )}
        <StyledFusebitEditorContainer onKeyUp={handleKeyUp}>
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
              },
            }}
            onLoaded={() => {
              setIsMounted(true);
            }}
          />
          {isMounted && <StyledFusebitEditorLogo src={logo} alt="fusebit logo" height="20" width="80" />}
        </StyledFusebitEditorContainer>
      </StyledEditorContainer>
    </Box>
  );
});

export default EditGui;
