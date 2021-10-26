import React from 'react';
import { SnackbarProvider } from 'notistack';
import {
  CheckCircleOutlineOutlined,
  ErrorOutlineOutlined,
  ReportProblemOutlined,
  InfoOutlined,
  Close,
} from '@material-ui/icons';
import { Box, IconButton } from '@material-ui/core';

const boxProps = {
  display: 'flex',
  alignItems: 'center',
  mr: '10px',
};

interface Props {
  children: React.ReactNode;
}

const SnackProvider: React.FC<Props> = ({ children }) => {
  const notistackRef: any = React.createRef();
  const handleClickDismiss = (key: any) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      ref={notistackRef}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      action={(key) => (
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClickDismiss(key)}>
          <Close fontSize="small" />
        </IconButton>
      )}
      iconVariant={{
        success: (
          <Box {...boxProps}>
            <CheckCircleOutlineOutlined />
          </Box>
        ),
        error: (
          <Box {...boxProps}>
            <ErrorOutlineOutlined />
          </Box>
        ),
        warning: (
          <Box {...boxProps}>
            <ReportProblemOutlined />
          </Box>
        ),
        info: (
          <Box {...boxProps}>
            <InfoOutlined />
          </Box>
        ),
      }}
    >
      {children}
    </SnackbarProvider>
  );
};

export default SnackProvider;
