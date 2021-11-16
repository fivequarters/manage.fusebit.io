import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogProps } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import * as CSC from '@components/globalStyle';
import * as SC from './styles';

interface Props extends DialogProps {
  onClose: () => void;
  open: boolean;
  children: React.ReactNode;
  disableActions?: boolean;
  title?: string;
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
  children,
  disableActions,
  ...props
}) => {
  return (
    <Dialog onClose={onClose} open={open} {...props}>
      {title && <SC.Title>{title}</SC.Title>}
      <SC.Content hasPadding={disableActions}>
        <CSC.CloseWrapper aria-label="close" onClick={onClose}>
          <CloseIcon />
        </CSC.CloseWrapper>
        {children}
      </SC.Content>
      {!disableActions && (
        <DialogActions>
          <Box display="flex" alignItems="center" justifyContent="center" width="100%" pb="32px">
            {hasCancel && (
              <Button style={{ width: 77, marginRight: 16 }} variant="outlined" onClick={onClose} color="primary">
                {cancelButtonText || 'Cancel'}
              </Button>
            )}
            <Button style={{ width: !hasCancel ? 200 : 77 }} variant="contained" onClick={onAccept} color="primary">
              {acceptButtonText || 'Accept'}
            </Button>
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;
