import { IconButton, Snackbar } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React from 'react';
import { useSnackbar } from '../../../hooks/useSnackbarContext';

const RootSnackbar: React.FC = () => {
  const { snack, hideSnack } = useSnackbar();

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={!!snack}
      autoHideDuration={6000}
      onClose={hideSnack}
      message={snack}
      action={
        <>
          <IconButton size="small" aria-label="close" color="primary" onClick={hideSnack}>
            <Close fontSize="small" />
          </IconButton>
        </>
      }
    />
  );
};

export default RootSnackbar;
