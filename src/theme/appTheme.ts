import { createMuiTheme, Theme } from '@material-ui/core/styles';

export const lightTheme: Theme = createMuiTheme({
  palette: {
    type: 'light',
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
  overrides: {
    MuiFormControl: {
      root: {
        marginBottom: '20px',
      },
    },
    MuiSnackbarContent: {
      root: {
        backgroundColor: '#F83420',
        borderRadius: '8px',
        padding: '10px 20px',
      },
      message: {
        fontFamily: 'Poppins',
        fontWeight: 300,
        fontSize: '14px',
      },
    },
    MuiDrawer: {
      paperAnchorBottom: {
        borderRadius: '8px 8px 0 0',
      },
    },
  },
  props: {
    MuiCheckbox: {
      color: 'primary',
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

export const darkTheme: Theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});
