import React from 'react';
import styled from 'styled-components';
import { Button, Modal, Backdrop } from '@material-ui/core';
import * as CSC from '@components/globalStyle';

const StyledCard = styled.div<{ open: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  opacity: ${(props) => (props.open ? 1 : 0)};
  padding: 64px;
  width: 480px;
  border-radius: 8px;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  outline: transparent;
  transition: all 1s linear;

  @media only screen and (max-width: 550px) {
    width: 100%;
    left: 0;
    top: auto;
    bottom: 0;
    transform: translate(0, 0);
  }
`;

const StyledButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
`;

interface Props {
  open: boolean;
  setOpen: Function;
  handleConfirmation: Function;
  title: string;
  description: string;
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
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => setOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <StyledCard open={open} tabIndex={-1}>
        <CSC.Close onClick={() => setOpen(false)} />
        <CSC.ModalTitle margin="0 0 16px 0">{title}</CSC.ModalTitle>
        <CSC.ModalDescription textAlign="center">{description}</CSC.ModalDescription>
        <StyledButtonsWrapper>
          {!hideCancelButton && (
            <Button
              onClick={() => setOpen(false)}
              style={{ width: '77px', marginRight: '16px' }}
              size="medium"
              variant="outlined"
              color="primary"
            >
              Cancel
            </Button>
          )}
          <Button onClick={onConfirm} style={{ width: '77px' }} size="medium" variant="contained" color="primary">
            {confirmationButtonText || 'Delete'}
          </Button>
        </StyledButtonsWrapper>
      </StyledCard>
    </Modal>
  );
};

export default ConfirmationPrompt;
