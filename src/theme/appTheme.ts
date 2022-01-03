import { createTheme, Theme } from '@mui/material/styles';

export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#F83420',
    },
    secondary: {
      main: 'rgba(215, 229, 255, 0.4)',
    },
    background: {
      default: '#fff',
    },
  },
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginBottom: '20px',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paperAnchorBottom: {
          borderRadius: '8px 8px 0 0',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&.Mui-selected': {
            backgroundColor: 'rgba(215, 229, 255, 0.4) !important',
          },
          '&.Mui-hover': {
            backgroundColor: 'rgba(215, 229, 255, 0.4) !important',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paperWidthSm: {
          maxWidth: '100%',
        },
        paperScrollPaper: {
          maxHeight: '100%',
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        color: 'primary',
      },
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
    fontFamily: [
      'Poppins',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
    ].join(','),
  },
});

export const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
  },
});
