import { createTheme, Theme, adaptV4Theme } from '@mui/material/styles';

export const lightTheme: Theme = createTheme(
  adaptV4Theme({
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
    overrides: {
      MuiFormControl: {
        root: {
          marginBottom: '20px',
        },
      },
      MuiDrawer: {
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
  })
);

export const darkTheme: Theme = createTheme(
  adaptV4Theme({
    palette: {
      mode: 'dark',
    },
  })
);
