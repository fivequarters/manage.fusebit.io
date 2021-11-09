import React from 'react';
import { Box, Button } from '@material-ui/core';
import { Props } from '@interfaces/cliAccess';
import CopyLine from '@components/common/CopyLine';
import * as CSC from '@components/globalStyle';
import * as SC from './styles';

const CliAccess = React.forwardRef<HTMLDivElement, Props>(({ open, onClose }, ref) => {
  return (
    <SC.Card open={open} ref={ref} tabIndex={-1}>
      <CSC.Close onClick={() => onClose()} />
      <CSC.ModalTitle>Grant CLI Access</CSC.ModalTitle>

      <Box display="flex">
        <CSC.LineTitle>1. Install the Fusebit CLI</CSC.LineTitle>
      </Box>
      <CopyLine text="npm install @fusebit/cli -g" highlightedText="install -g" />

      <Box display="flex">
        <CSC.LineTitle>2. Run the following initialization command</CSC.LineTitle>
      </Box>
      <CopyLine text="fuse init" highlightedText="init" />

      <SC.ButtonsWrapper>
        <SC.OutlinedButtonWrapper>
          <Button onClick={() => onClose()} variant="outlined" color="primary">
            Done
          </Button>
        </SC.OutlinedButtonWrapper>
      </SC.ButtonsWrapper>
    </SC.Card>
  );
});

export default CliAccess;
