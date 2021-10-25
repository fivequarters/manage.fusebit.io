import { Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import React from 'react';
import styled from 'styled-components';
import { useSnackbar } from '../../../hooks/useSnackbarContext';

const StyledSnackbar = styled(Snackbar)`
  .MuiAlert-message {
    border-radius: 8px;
    font-family: 'Poppins';
    font-weight: 300;
  }
`;

const Alert = (props: AlertProps) => {
  return <MuiAlert variant="filled" {...props} />;
};

const RootSnackbar: React.FC = () => {
  const { snack, hideSnack } = useSnackbar();

  return (
    <StyledSnackbar
      anchorOrigin={{
        vertical: snack.vertical,
        horizontal: snack.horizontal,
      }}
      open={snack.open}
      autoHideDuration={10000}
      onClose={hideSnack}
    >
      <Alert onClose={hideSnack} severity={snack.type}>
        {snack.message}
      </Alert>
    </StyledSnackbar>
  );
};

export default RootSnackbar;
