import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Drawer, Button, Box, Typography } from '@material-ui/core';
import * as CSC from '@components/globalStyle';
import play from '@assets/play.svg';
import info from '@assets/info.svg';
import useEditor from '@components/IntegrationDetailDevelop/FusebitEditor/useEditor';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import { useAuthContext } from '@hooks/useAuthContext';
import { useLoader } from '@hooks/useLoader';
import FusebitEditor from '../FusebitEditor';

const StyledGuiMobileWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  padding-top: 76px;
`;

const StyledEditorWrapper = styled.div`
  position: absolute;
  height: 1px;
  width: 1px;
  left: -100vw;
  bottom: -100vh;
`;

const StyledGuiMobileNotSupportedWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 40px;
`;

const StyledGuiMobileNotSupportedIcon = styled.img`
  height: 16px;
  width: 16px;
  object-fit: contain;
`;

const StyledGuiMobileNotSupportedText = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: var(--black);
  margin-left: 12px;
`;

const StyledLogWrapper = styled(Box)`
  background-color: var(--secondary-color);
  color: var(--black);
`;

const StyledLogTitle = styled(Typography)`
  font-size: 14px;
  line-height: 20px;
  color: var(--black);
`;

const StyledLog = styled(Box)`
  background-color: #ffffff;
  word-wrap: break-word;
`;

interface Props {
  integrationId: string;
  open: boolean;
  onClose: () => void;
}

const MobileDrawer = ({ open, onClose, integrationId }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const { handleRun, isRunning, logs, setLogs } = useEditor({ enableListener: open, isMounted });
  const { userData } = useAuthContext();
  const { createLoader, removeLoader } = useLoader();

  useEffect(() => {
    if (!isMounted && open) {
      createLoader();
    }
  }, [isMounted, open, createLoader]);

  const handleLogClear = () => {
    setLogs([]);
  };

  const handleClose = () => {
    handleLogClear();
    setIsMounted(false);
    onClose();
  };

  return (
    <>
      {open && (
        <StyledEditorWrapper>
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
              removeLoader();
              setIsMounted(true);
            }}
          />
        </StyledEditorWrapper>
      )}

      <Drawer anchor="bottom" open={open && isMounted} onClose={handleClose}>
        <>
          <StyledGuiMobileWrapper>
            <CSC.CloseWrapper onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </CSC.CloseWrapper>
            <Button
              startIcon={<img src={play} alt="play" height="16" width="16" />}
              style={{ width: '200px' }}
              size="large"
              variant="contained"
              color="primary"
              onClick={handleRun}
              disabled={isRunning}
            >
              {isRunning ? 'Running...' : 'Run'}
            </Button>
            <StyledGuiMobileNotSupportedWrapper>
              <StyledGuiMobileNotSupportedIcon src={info} alt="not supported" height="16" width="16" />
              <StyledGuiMobileNotSupportedText>Editing is not supported on this device</StyledGuiMobileNotSupportedText>
            </StyledGuiMobileNotSupportedWrapper>
          </StyledGuiMobileWrapper>
          <StyledLogWrapper padding="21px 30px 0">
            <Box display="flex" alignItems="center">
              <StyledLogTitle>Log Console</StyledLogTitle>
              <Box marginLeft="auto" color="inherit" onClick={handleLogClear}>
                <DeleteIcon color="inherit" style={{ width: '20px' }} />
              </Box>
            </Box>
            <StyledLog
              fontSize="10px"
              lineHeight="11.5px"
              fontFamily="Courier"
              height="165px"
              padding="15px 7px"
              borderRadius="4px"
              marginTop="10px"
              overflow="scroll"
            >
              {logs.map((log) => (
                <p key={log.id}>{log.msg}</p>
              ))}
            </StyledLog>
          </StyledLogWrapper>
        </>
      </Drawer>
    </>
  );
};

export default MobileDrawer;
