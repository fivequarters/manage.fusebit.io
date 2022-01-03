import React from 'react';
import { SnackbarProvider } from 'notistack';
import {
  CheckCircleOutlineOutlined,
  ErrorOutlineOutlined,
  ReportProblemOutlined,
  InfoOutlined,
  Close,
} from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';

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
      autoHideDuration={5000}
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
