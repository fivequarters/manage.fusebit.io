import React from 'react';
import { Backdrop, Button, Modal } from '@material-ui/core';
import { Props } from '@interfaces/cliAccess';
import CopyLine from '@components/common/CopyLine';
import * as CSC from '@components/globalStyle';
import HighlightedCommand from '@components/common/HighlightedCommand';
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
        <CopyLine text="npm install @fusebit/cli -g">
          <HighlightedCommand command="npm install @fusebit/cli -g" keyWords="install -g" />
        </CopyLine>

        <CSC.Flex>
          <CSC.LineTitle>2. Run the following initialization command</CSC.LineTitle>
        </CSC.Flex>
        <CopyLine text="fuse init">
          <HighlightedCommand command="fuse init" keyWords="init" />
        </CopyLine>

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
