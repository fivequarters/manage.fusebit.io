import React from 'react';
import { Drawer, Button } from '@material-ui/core';
import * as SC from './styles';
import * as CSC from '../../../../globalStyle';
import play from '../../../../../assets/play.svg';
import info from '../../../../../assets/info.svg';
import useEditor from '../EditGui/useEditor';

interface Props {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer = ({ open, onClose }: Props) => {
  const { handleRun, isRunning } = useEditor();

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <SC.GuiMobileWrapper>
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
        <SC.GuiMobileNotSupportedWrapper>
          <SC.GuiMobileNotSupportedIcon src={info} alt="not supported" height="16" width="16" />
          <SC.GuiMobileNotSupportedText>Editing is not supported on this device</SC.GuiMobileNotSupportedText>
        </SC.GuiMobileNotSupportedWrapper>
      </SC.GuiMobileWrapper>
    </Drawer>
  );
};

export default MobileDrawer;
