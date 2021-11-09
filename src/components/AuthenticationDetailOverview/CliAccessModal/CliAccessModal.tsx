import React from 'react';
import { Backdrop, Button, Modal } from '@material-ui/core';
import { Props } from '@interfaces/cliAccess';
import CopyLine from '@components/common/CopyLine';
import * as CSC from '@components/globalStyle';
import * as SC from './styles';

const CliAccessModal = React.forwardRef<HTMLDivElement, Props>(({ open, onClose }, ref) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => onClose()}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <SC.Card open={open} ref={ref} tabIndex={-1}>
        <CSC.Close onClick={() => onClose()} />
        <CSC.ModalTitle>Grant CLI Access</CSC.ModalTitle>

        <CSC.Flex>
          <CSC.LineTitle>1. Install the Fusebit CLI</CSC.LineTitle>
        </CSC.Flex>
        <CopyLine text="npm install @fusebit/cli -g" highlightedText="install -g" />

        <CSC.Flex>
          <CSC.LineTitle>2. Run the following initialization command</CSC.LineTitle>
        </CSC.Flex>
        <CopyLine text="fuse init" highlightedText="init" />

        <SC.ButtonsWrapper>
          <SC.OutlinedButtonWrapper>
            <Button onClick={() => onClose()} variant="outlined" color="primary">
              Done
            </Button>
          </SC.OutlinedButtonWrapper>
        </SC.ButtonsWrapper>
      </SC.Card>
    </Modal>
  );
});

export default CliAccessModal;
