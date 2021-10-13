import React from 'react';
import * as SC from './styles';
import { Box, Button, Dialog, DialogActions, DialogProps } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

interface Props extends DialogProps {
  onClose: () => void;
  open: boolean;
  content: React.ReactNode;
  title: string;
  onAccept?: () => void;
  hasCancel?: boolean;
  cancelButtonText?: string;
  acceptButtonText?: string;
}

const Modal: React.FC<Props> = ({
  onClose,
  onAccept,
  hasCancel,
  open,
  title,
  cancelButtonText,
  acceptButtonText,
  content,
  ...props
}) => {
  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    } else {
      onClose();
    }
  };

  return (
    <Dialog onClose={onClose} open={open} {...props}>
      <SC.Title>{title}</SC.Title>
      <SC.Content>
        <SC.CloseWrapper aria-label="close" onClick={onClose}>
          <CloseIcon />
        </SC.CloseWrapper>
        {content}
      </SC.Content>
      <DialogActions>
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" pb="32px">
          {hasCancel && (
            <Button variant="outlined" onClick={onClose} color="primary">
              {cancelButtonText || 'Cancel'}
            </Button>
          )}
          <Button style={{ width: '200px' }} variant="contained" onClick={handleAccept} color="primary">
            {acceptButtonText || 'Accept'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
