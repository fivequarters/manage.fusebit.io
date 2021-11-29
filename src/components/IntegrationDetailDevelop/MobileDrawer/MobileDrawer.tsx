import React from 'react';
import styled from 'styled-components';
import { Drawer, Button, Box, Typography } from '@material-ui/core';
import * as CSC from '@components/globalStyle';
import play from '@assets/play.svg';
import info from '@assets/info.svg';
import useEditor from '@components/IntegrationDetailDevelop/FusebitEditor/useEditor';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

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
}

const MobileDrawer = ({ open, onClose }: Props) => {
  const { handleRun, isRunning } = useEditor({ enableListener: open });

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <StyledGuiMobileWrapper>
        <CSC.CloseWrapper onClick={onClose}>
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
          <Box marginLeft="auto" color="inherit">
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
          [3:21:55 PM] SERVER STDOUT: Sending POST request to
          https://api.us-west-1.on.fusebit.io/v2/account/acc-c77ac40bf57b4650/subscription/sub-800d88b500e14eeb/integration/LinearMobileTest/api/tenant/user-1/test
          [3:21:57 PM] SERVER STDOUT: Received response status 200 [3:21:55 PM] SERVER STDOUT: Sending POST request to
          https://api.us-west-1.on.fusebit.io/v2/account/acc-c77ac40bf57b4650/subscription/sub-800d88b500e14eeb/integration/LinearMobileTest/api/tenant/user-1/test
          [3:21:57 PM] SERVER STDOUT: Received response status 200
        </StyledLog>
      </StyledLogWrapper>
    </Drawer>
  );
};

export default MobileDrawer;
