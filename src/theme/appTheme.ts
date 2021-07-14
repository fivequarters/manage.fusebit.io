import { createMuiTheme, Theme } from '@material-ui/core/styles';

export const lightTheme: Theme = createMuiTheme({
    palette: {
        type: "light",
        primary: {
            main: "#F83420"

        },
        secondary: {
            main: "rgba(215, 229, 255, 0.4)"
        },
        background: {
            default: "white"
        }
    },
    overrides: {
        MuiFormControl: {
          root: {
            marginBottom: "49px",
            variant: "outlined",
          }
        }
    },
    typography: {
        button: {
          textTransform: "none",
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
      }
});

export const darkTheme: Theme = createMuiTheme({
    palette: {
        type: "dark"
    },
});