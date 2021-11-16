import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogProps,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';

const StyledCloseWrapper = styled(IconButton)`
  position: absolute;
  right: 16px;
  top: 16px;
  color: var(--black);
`;

const StyledTitle = styled(DialogTitle)`
  padding-top: 64px;
  > h2 {
    font-size: 24px;
    line-height: 30px;
    font-weight: 600;
    color: var(--black);
    text-align: center;
  }
`;

const StyledContent = styled(DialogContent)`
  padding: 40px;
  padding-top: 24px;
`;

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
  return (
    <Dialog onClose={onClose} open={open} {...props}>
      <StyledTitle>{title}</StyledTitle>
      <StyledContent>
        <StyledCloseWrapper aria-label="close" onClick={onClose}>
          <CloseIcon />
        </StyledCloseWrapper>
        {content}
      </StyledContent>
      <DialogActions>
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" pb="32px">
          {hasCancel && (
            <Button variant="outlined" onClick={onClose} color="primary">
              {cancelButtonText || 'Cancel'}
            </Button>
          )}
          <Button style={{ width: 200 }} variant="contained" onClick={onAccept} color="primary">
            {acceptButtonText || 'Accept'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
