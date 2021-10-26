import constate from 'constate';
import { useState } from 'react';
import { Snackbar, SnackbarHorizontal, SnackbarType, SnackbarVertical } from '../interfaces/snackbar';

const defaultSnack: Snackbar = {
  open: false,
  message: '',
  type: 'success',
  vertical: 'bottom',
  horizontal: 'center',
};

const _useSnackbarContext = () => {
  const [snack, setSnack] = useState<Snackbar>(defaultSnack);

  const hideSnack = () => {
    setSnack(defaultSnack);
  };

  const changeSnack = (
    message: string,
    type: SnackbarType,
    vertical?: SnackbarVertical,
    horizontal?: SnackbarHorizontal
  ) => {
    setSnack({
      open: true,
      message,
      type,
      vertical: vertical || defaultSnack.vertical,
      horizontal: horizontal || defaultSnack.horizontal,
    });
  };

  return { snack, hideSnack, changeSnack };
};

const [SnackbarProvider, useSnackbar] = constate(_useSnackbarContext);

export { SnackbarProvider, useSnackbar };
