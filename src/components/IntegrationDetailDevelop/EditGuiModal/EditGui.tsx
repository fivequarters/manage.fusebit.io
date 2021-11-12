import React, { useState, useEffect } from 'react';
import { Box, Button, ButtonGroup } from '@material-ui/core';
import { SaveOutlined, PlayArrowOutlined } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Props } from '@interfaces/edit';
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
import * as SC from './styles';

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

  useTrackPage('Web Editor', 'Web Editor');
  useTitle(`${id} Editor`);

  useEffect(() => {
    const createAddNewItemElement = (lastItem: Element) => {
      const addNew = document.createElement('div');
      addNew.setAttribute('id', 'addNewItem');
      addNew.setAttribute('style', SC.addNewStyles);
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
      icon.setAttribute('style', SC.addNewIcon);
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
      <SC.EditorContainer ref={ref}>
        {isMounted && (
          <SC.CloseHeader>
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
                onClick={handleRun}
                disabled={isFindingInstall || isSaving}
              >
                {isFindingInstall ? <CircularProgress size={20} /> : 'Run'}
              </Button>
              <Button onClick={() => setConfigureRunnerActive(true)} size="small" variant="contained" color="primary">
                <img src={settings} alt="settings" height="16" width="16" />
              </Button>
            </ButtonGroup>
            <h3>{integrationId}</h3>
            <SC.ActionsHelpWrapper>
              <SC.ActionsHelpLink target="_blank" href="https://developer.fusebit.io/docs/developing-locally">
                Edit locally
              </SC.ActionsHelpLink>
              <SC.ActionsHelpImage src={question} alt="question" height="16" width="16" />
            </SC.ActionsHelpWrapper>
            <SC.Close onClick={handleClose} />
          </SC.CloseHeader>
        )}
        <SC.FusebitEditorContainer onKeyUp={handleKeyUp}>
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
          {isMounted && <SC.FusebitEditorLogo src={logo} alt="fusebit logo" height="20" width="80" />}
        </SC.FusebitEditorContainer>
      </SC.EditorContainer>
    </Box>
  );
});

export default EditGui;
