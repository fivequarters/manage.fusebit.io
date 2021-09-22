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

const EditGui = React.forwardRef(({ onClose, integrationId }: Props) => {
  const { userData } = useContext();
  const [isMounted, setIsMounted] = useState(false);
  const { createLoader, removeLoader } = useLoader();

  useEffect(() => {
    if (isMounted) {
      removeLoader();
    } else {
      createLoader();
    }
  }, [isMounted, createLoader, removeLoader]);

  return (
    <>
      <SC.EditorContainer>
        {isMounted && (
          <>
            <SC.CloseHeader>
              <h3>Edit hbspotIntegration-298</h3>
              <SC.Close onClick={onClose} />
            </SC.CloseHeader>
            <SC.Actions>
              <ButtonGroup variant="contained" style={{ marginRight: '24px' }}>
                <Button
                  startIcon={<img src={play} alt="play" height="16" width="16" />}
                  size="medium"
                  variant="contained"
                  color="primary"
                >
                  Run
                </Button>
                <Button size="small" variant="contained" color="primary">
                  <img src={settings} alt="settings" height="16" width="16" />
                </Button>
              </ButtonGroup>
              <Button
                startIcon={<img src={save} alt="play" height="16" width="16" />}
                size="medium"
                variant="outlined"
                color="primary"
              >
                Save
              </Button>
              <SC.ActionsHelpWrapper>
                <SC.ActionsHelpLink href="/">Edit Locally</SC.ActionsHelpLink>
                <SC.ActionsHelpImage src={question} alt="question" height="16" width="16" />
              </SC.ActionsHelpWrapper>
            </SC.Actions>
          </>
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
