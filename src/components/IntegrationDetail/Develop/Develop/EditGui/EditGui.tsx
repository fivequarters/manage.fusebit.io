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

const EditGui = React.forwardRef(({ onClose, integrationId }: Props) => {
  const { userData } = useContext();
  const [isMounted, setIsMounted] = useState(false);
  const [configureRunnerActive, setConfigureRunnerActive] = useState(false);
  const { createLoader, removeLoader } = useLoader();
  const { handleRun } = useEditor();

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
  }, [isMounted, createLoader, removeLoader]);

  return (
    <>
      <SC.EditorContainer>
        <ConfigureRunnerModal open={configureRunnerActive} setOpen={setConfigureRunnerActive} />
        {isMounted && (
          <SC.CloseHeader>
            <ButtonGroup variant="contained" style={{ marginRight: '16px' }}>
              <Button
                startIcon={<img src={play} alt="play" height="16" width="16" />}
                size="small"
                variant="contained"
                color="primary"
                onClick={handleRun}
              >
                Run
              </Button>
              <Button onClick={() => setConfigureRunnerActive(true)} size="small" variant="contained" color="primary">
                <img src={settings} alt="settings" height="16" width="16" />
              </Button>
            </ButtonGroup>
            <Button
              startIcon={<img src={save} alt="play" height="16" width="16" />}
              size="small"
              variant="outlined"
              color="primary"
            >
              Save
            </Button>
            <h3>{integrationId}</h3>
            <SC.ActionsHelpWrapper>
              <SC.ActionsHelpLink href="/">Edit Locally</SC.ActionsHelpLink>
              <SC.ActionsHelpImage src={question} alt="question" height="16" width="16" />
            </SC.ActionsHelpWrapper>
            <SC.Close onClick={onClose} />
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
            options={{ entityType: 'integration' }}
            onLoaded={() => setIsMounted(true)}
          />
          {isMounted && <SC.FusebitEditorLogo src={logo} alt="fusebit logo" height="20" width="80" />}
        </SC.FusebitEditorContainer>
      </SC.EditorContainer>
    </>
  );
});

export default EditGui;
