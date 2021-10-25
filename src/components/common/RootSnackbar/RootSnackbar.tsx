import { IconButton, Snackbar } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';
import { useSnackbar } from '../../../hooks/useSnackbarContext';

const StyledSnackbar = styled(Snackbar)`
  border-radius: 8px;
`;

const RootSnackbar: React.FC = () => {
  const { snack, hideSnack } = useSnackbar();

  return (
    <StyledSnackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={!!snack}
      autoHideDuration={10000}
      onClose={hideSnack}
      message={snack}
      action={
        <>
          <IconButton size="small" aria-label="close" color="inherit" onClick={hideSnack}>
            <Close fontSize="small" />
          </IconButton>
        </>
      }
    />
  );
};

export default RootSnackbar;
