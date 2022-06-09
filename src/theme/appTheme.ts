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
    MuiDrawer: {
      root: {
        zIndex: 10,
      },
      paperAnchorBottom: {
        borderRadius: '8px 8px 0 0',
      },
    },
    MuiListItem: {
      root: {
        borderRadius: 4,
        '&:selected': {
          backgroundColor: 'rgba(215, 229, 255, 0.4) !important',
        },
        '&:hover': {
          backgroundColor: 'rgba(215, 229, 255, 0.4) !important',
        },
      },
    },
    MuiDialog: {
      paperWidthSm: {
        maxWidth: '100%',
      },
      paperScrollPaper: {
        maxHeight: '100%',
      },
    },
    MuiLinearProgress: {
      buffer: {
        backgroundColor: '#F83420',
      },
      colorPrimary: {
        backgroundColor: '#ECECEC',
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
