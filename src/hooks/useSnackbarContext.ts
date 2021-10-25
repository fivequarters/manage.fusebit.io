import constate from 'constate';
import { useState } from 'react';

const _useSnackbarContext = () => {
  const [snack, setSnack] = useState<string | null>('asdasd');

  const hideSnack = () => {
    setSnack(null);
  };

  return { snack, setSnack, hideSnack };
};

const [SnackbarProvider, useSnackbar] = constate(_useSnackbarContext);

export { SnackbarProvider, useSnackbar };
