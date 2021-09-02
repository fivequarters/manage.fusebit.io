import React from 'react';
import * as SC from './styles';
import * as CSC from '../../../../globalStyle';
import { Props } from '../../../../../interfaces/cliAccess';
import { Button } from '@material-ui/core';
import CopyLine from '../../../../CopyLine';

const CliAccess = React.forwardRef(({ open, onClose, token }: Props, ref) => {
  return (
    <SC.Card open={open}>
      <CSC.Close onClick={() => onClose()} />
      <CSC.ModalTitle>Grant CLI Access</CSC.ModalTitle>

      <CSC.Flex>
        <CSC.LineTitle>1. Install the Fusebit CLI</CSC.LineTitle>
      </CSC.Flex>
      <CopyLine text={'npm install @fusebit/cli -g'} highlightedText="install -g" />

      <CSC.Flex>
        <CSC.LineTitle margin="10px">2. Run the following initialization command</CSC.LineTitle>
      </CSC.Flex>
      <CSC.ModalDescription>The one-time token in the command is valid for eight hours.</CSC.ModalDescription>
      <CopyLine text={'fuse init ' + token} highlightedText="init" />

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
