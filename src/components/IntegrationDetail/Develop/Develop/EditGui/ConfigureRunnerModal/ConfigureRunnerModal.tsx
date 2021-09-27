import React, { useState } from 'react';
import { Button, Modal, Backdrop } from '@material-ui/core';
import * as SC from './styles';
import * as CSC from '../../../../../globalStyle';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ConfigureRunnerModal: React.FC<Props> = ({ open, setOpen }) => {
  const [verbSelectorActive, setVerbSelectorActive] = useState(false);

  const handleSave = () => {
    setOpen(false);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => setOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <SC.Card open={open}>
        <CSC.Close onClick={() => setOpen(false)} />
        <CSC.ModalTitle margin="0 0 16px 0">Configure runner</CSC.ModalTitle>
        <CSC.DefaultFlex>
          <CSC.Flex width="max-content" margin="0 48px 0 0" flexDown>
            <SC.Subtitle>Verb</SC.Subtitle>
            <SC.VerbSelector onClick={() => setVerbSelectorActive(!verbSelectorActive)}>
              GET <SC.VerbArrow active={verbSelectorActive} />
            </SC.VerbSelector>
          </CSC.Flex>
          <CSC.Flex flexDown>
            <SC.Subtitle>Verb</SC.Subtitle>
            <SC.Textarea />
          </CSC.Flex>
        </CSC.DefaultFlex>
        <CSC.Flex margin="49px 0 0 0" flexDown>
          <SC.Subtitle>Payload</SC.Subtitle>
          <SC.Textarea height="137px" />
        </CSC.Flex>
        <SC.ButtonsWrapper>
          <Button
            onClick={handleSave}
            style={{ width: '200px', marginLeft: 'auto', marginTop: '42px' }}
            size="large"
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </SC.ButtonsWrapper>
      </SC.Card>
    </Modal>
  );
};

export default ConfigureRunnerModal;
