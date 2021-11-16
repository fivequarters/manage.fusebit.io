import React from 'react';
import styled from 'styled-components';
import { Drawer, Button } from '@material-ui/core';
import * as CSC from '@components/globalStyle';
import play from '@assets/play.svg';
import info from '@assets/info.svg';
import useEditor from '@components/IntegrationDetailDevelop/FusebitEditor/useEditor';

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

interface Props {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer = ({ open, onClose }: Props) => {
  const { handleRun, isRunning } = useEditor({ enableListener: open });

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <StyledGuiMobileWrapper>
        <CSC.Close onClick={onClose} />
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
    </Drawer>
  );
};

export default MobileDrawer;
