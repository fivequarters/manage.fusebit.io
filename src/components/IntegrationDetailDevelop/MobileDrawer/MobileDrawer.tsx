import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Drawer, Button, Box, Typography } from '@material-ui/core';
import * as CSC from '@components/globalStyle';
import play from '@assets/play.svg';
import info from '@assets/info.svg';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import useEditorEvents from '../FusebitEditor/useEditorEvents';
import useProcessing from '../hooks/useProcessing';
import { logWithTime } from '../FusebitEditor/utils';
import { BUILDING_TEXT, BUILD_COMPLETED_TEXT } from '../FusebitEditor/constants';
import { EditorEvents } from '~/enums/editor';

const StyledGuiMobileWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  padding-top: 76px;
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
  open: boolean;
  onClose: () => void;
  handleRun: () => void;
  isRunning: boolean;
}

const MobileDrawer = ({ open, onClose, handleRun, isRunning }: Props) => {
  const { logs, setLogs, clearLogs } = useEditorEvents({
    isMounted: open,
    events: [EditorEvents.LogsEntry, EditorEvents.LogsAttached, EditorEvents.RunnerFinished],
  });
  const { processing } = useProcessing({
    onProcessingStarted: () => {
      // wait for the logs to be attached,
      setTimeout(() => {
        setLogs((oldLogs) => [...oldLogs, logWithTime(BUILDING_TEXT)]);
      }, 1000);
    },
    onProcessingCompleted: () => {
      setLogs((oldLogs) => [...oldLogs, logWithTime(BUILD_COMPLETED_TEXT)]);
    },
  });

  useEffect(() => {
    if (logs.length > 0) {
      const mobileLog = document.getElementById('mobile-log');
      if (mobileLog) {
        mobileLog.scrollTop = mobileLog.scrollHeight;
      }
    }
  }, [logs]);

  const handleClose = () => {
    clearLogs();
    onClose();
  };

  const buttonText = useMemo(() => {
    if (processing) {
      return 'Building...';
    }

    if (isRunning) {
      return 'Running...';
    }

    return 'Run';
  }, [processing, isRunning]);

  return (
    <>
      <Drawer anchor="bottom" open={open} onClose={handleClose}>
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
              disabled={isRunning || processing}
            >
              {buttonText}
            </Button>
            <StyledGuiMobileNotSupportedWrapper>
              <StyledGuiMobileNotSupportedIcon src={info} alt="not supported" height="16" width="16" />
              <StyledGuiMobileNotSupportedText>
                Editing is currently only available on desktop mode
              </StyledGuiMobileNotSupportedText>
            </StyledGuiMobileNotSupportedWrapper>
          </StyledGuiMobileWrapper>
          <StyledLogWrapper padding="21px 30px 0">
            <Box display="flex" alignItems="center">
              <StyledLogTitle>Log Console</StyledLogTitle>
              <Box marginLeft="auto" color="inherit" onClick={clearLogs}>
                <DeleteIcon color="inherit" style={{ width: '20px' }} />
              </Box>
            </Box>
            <StyledLog
              id="mobile-log"
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
