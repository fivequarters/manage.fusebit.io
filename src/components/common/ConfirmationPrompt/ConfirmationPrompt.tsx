import React from 'react';
import Modal from '@components/common/Modal';
import * as CSC from '@components/globalStyle';

interface Props {
  open: boolean;
  setOpen: Function;
  handleConfirmation: Function;
  title: string;
  description: string | React.ReactElement;
  confirmationButtonText?: string;
  hideCancelButton?: boolean;
}

const ConfirmationPrompt: React.FC<Props> = ({
  open,
  setOpen,
  handleConfirmation,
  title,
  description,
  confirmationButtonText,
  hideCancelButton,
}) => {
  const onConfirm = () => {
    setOpen(false);
    handleConfirmation();
  };

  return (
    <Modal
      title={title}
      open={open}
      hasCancel={!hideCancelButton}
      onAccept={onConfirm}
      acceptButtonText={confirmationButtonText || 'Delete'}
      onClose={() => setOpen(false)}
    >
      <CSC.ModalDescription margin="0 24px" maxWidth="350px" textAlign="center">
        {description}
      </CSC.ModalDescription>
    </Modal>
  );
};

export default ConfirmationPrompt;
