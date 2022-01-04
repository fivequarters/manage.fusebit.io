import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogProps, DialogContent, DialogTitle } from '@mui/material';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import * as CSC from '@components/globalStyle';

const StyledTitle = styled(DialogTitle)`
  padding-top: 64px;
  font-size: 24px;
  line-height: 30px;
  font-weight: 600;
  max-width: 350px;
  margin: 0 auto;
  color: var(--black);
  text-align: center;
`;

export const StyledContent = styled(DialogContent)<{ hasPadding?: boolean }>`
  padding: ${(props) => props.hasPadding && '24px 40px 40px'};
  width: 100%;
`;

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
    <Dialog onClose={onClose} open={open} {...props} disableEnforceFocus>
      {title && <StyledTitle>{title}</StyledTitle>}
      <StyledContent hasPadding={disableActions}>
        <CSC.CloseWrapper aria-label="close" onClick={onClose}>
          <CloseIcon />
        </CSC.CloseWrapper>
        {children}
      </StyledContent>
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
