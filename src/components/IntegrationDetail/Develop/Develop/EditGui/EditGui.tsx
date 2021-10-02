import React, { useState, useEffect } from 'react';
import * as SC from './styles';
import { Props } from '../../../../../interfaces/edit';
import { useContext } from '../../../../../hooks/useContext';
import FusebitEditor from './FusebitEditor';
import { useLoader } from '../../../../../hooks/useLoader';
import { Button, ButtonGroup } from '@material-ui/core';
import play from '../../../../../assets/play.svg';
import settings from '../../../../../assets/settings.svg';
import save from '../../../../../assets/save.svg';
import question from '../../../../../assets/question.svg';
import logo from '../../../../../assets/logo.svg';
import useEditor from './useEditor';
import ConfigureRunnerModal from './ConfigureRunnerModal';
import ConfirmationPrompt from '../../../../ConfirmationPrompt';
import { useTrackPage } from '../../../../../hooks/useTrackPage';
import { trackEvent } from '../../../../../utils/analytics';
import CircularProgress from '@material-ui/core/CircularProgress';

const EditGui = React.forwardRef(({ onClose, onMount, integrationId }: Props, ref) => {
  const { userData } = useContext();
  const [isMounted, setIsMounted] = useState(false);
  const [configureRunnerActive, setConfigureRunnerActive] = useState(false);
  const [unsavedWarning, setUnsavedWarning] = useState(false);
  const { createLoader, removeLoader } = useLoader();
  const [loginFlowModalOpen, setLoginFlowModalOpen] = useState(false);
  const { handleRun, handleNoInstanceFound, isFindingInstance } = useEditor({
    onNoInstanceFound: () => setLoginFlowModalOpen(true),
  });

  useTrackPage('Web Editor', 'Web Editor');

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
          input && createAddNewItemElement(input);
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
  }, [isMounted, onMount, createLoader, removeLoader]);

  useEffect(() => {
    if (isMounted) {
      onMount?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const handleSave = () => {
    const context = window.editor;
    trackEvent('Save Button Clicked', 'Web Editor');
    context._server.saveFunction(context);
  };

  const handleClose = () => {
    window.editor.dirtyState ? setUnsavedWarning(true) : onClose();
  };

  return (
    <>
      <ConfirmationPrompt
        open={unsavedWarning}
        setOpen={setUnsavedWarning}
        handleConfirmation={onClose}
        title={`​Are you sure you want to discard unsaved changes?`}
        description={`You have made some unsaved changes to your Integration. Closing this window will discard those changes.`}
        confirmationButtonText={`Discard`}
      />
      <ConfirmationPrompt
        open={loginFlowModalOpen}
        setOpen={setLoginFlowModalOpen}
        handleConfirmation={handleNoInstanceFound}
        title="Start login flow?"
        description="The integration needs to know the Identity of the user on whose behalf to execute. For development purposes, please log in as your own user."
        confirmationButtonText="Start"
        hideCancelButton
      />
      <SC.EditorContainer>
        <ConfigureRunnerModal open={configureRunnerActive} setOpen={setConfigureRunnerActive} />
        {isMounted && (
          <SC.CloseHeader>
            <Button
              style={{ marginRight: '16px' }}
              startIcon={<img src={save} alt="play" height="16" width="16" />}
              onClick={handleSave}
              size="small"
              variant="outlined"
              color="primary"
            >
              Save
            </Button>
            <ButtonGroup variant="contained">
              <Button
                startIcon={<img src={play} alt="play" height="16" width="16" />}
                size="small"
                variant="contained"
                color="primary"
                onClick={handleRun}
                disabled={isFindingInstance}
              >
                {isFindingInstance ? <CircularProgress size={20} /> : 'Run'}
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
        <SC.FusebitEditorContainer>
          <FusebitEditor
            boundaryId={'integration'}
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
    </>
  );
});

export default EditGui;
