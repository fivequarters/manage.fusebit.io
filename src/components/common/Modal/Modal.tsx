import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogProps, DialogContent, DialogTitle } from '@material-ui/core';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import * as CSC from '@components/globalStyle';

const StyledDialog = styled(Dialog)`
  .MuiDialog-paperScrollPaper {
    max-width: 100%;
    max-height: 100%;
  }
`;

const StyledTitle = styled(DialogTitle)`
  padding-top: 64px !important;

  > h2 {
    font-size: 24px;
    line-height: 30px;
    font-weight: 600;
    max-width: 350px;
    margin: 0 auto;
    color: var(--black);
    text-align: center;
  }
`;

export const StyledContent = styled(DialogContent)<{ hasPadding?: boolean }>`
  padding: ${(props) => props.hasPadding && '24px 40px 40px'};
  width: 100%;
`;

interface Props extends DialogProps {
  open: boolean;
  children: React.ReactNode;
  disableActions?: boolean;
  disableClose?: boolean;
  title?: string;
  onClose?: () => void;
  onAccept?: () => void;
  hasCancel?: boolean;
  cancelButtonText?: string;
  acceptButtonText?: string;
  removePadding?: boolean;
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
  disableClose,
  removePadding,
  ...props
}) => {
  return (
    <StyledDialog onClose={onClose} open={open} {...props} disableEnforceFocus>
      {title && <StyledTitle>{title}</StyledTitle>}
      <StyledContent hasPadding={disableActions && !removePadding}>
        {!disableClose && (
          <CSC.CloseWrapper aria-label="close" onClick={onClose}>
            <CloseIcon />
          </CSC.CloseWrapper>
        )}

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
    </StyledDialog>
  );
};

export default Modal;
