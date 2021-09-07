import React from 'react';
import * as SC from './styles';
import * as CSC from '../globalStyle';
import { Button, Modal, Backdrop } from '@material-ui/core';
import { Props } from '../../interfaces/confirmationPrompt';

const ConfirmationPrompt: React.FC<Props> = ({
  open,
  setOpen,
  handleConfirmation,
  title,
  description,
  confirmationButtonText,
}) => {
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
        <CSC.ModalTitle>{title}</CSC.ModalTitle>
        <CSC.ModalDescription textAlign="center">{description}</CSC.ModalDescription>
        <SC.ButtonsWrapper>
          <Button
            onClick={() => setOpen(false)}
            style={{ width: '77px', marginRight: '16px' }}
            size="medium"
            variant="outlined"
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleConfirmation()}
            style={{ width: '77px' }}
            size="medium"
            variant="contained"
            color="primary"
          >
            {confirmationButtonText ? confirmationButtonText : 'Delete'}
          </Button>
        </SC.ButtonsWrapper>
      </SC.Card>
    </Modal>
  );
};

export default ConfirmationPrompt;
