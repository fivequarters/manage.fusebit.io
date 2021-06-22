import { createMuiTheme, Theme } from '@material-ui/core/styles';

export const lightTheme: Theme = createMuiTheme({
    palette: {
        type: "light",
        primary: {
            main: "#FF6422"
        },
        secondary: {
            main: "rgba(215, 229, 255, 0.4)"
        },
        background: {
            default: "white"
        }
    },
    typography: {
        button: {
          textTransform: "none",
        }
      }
});

export const darkTheme: Theme = createMuiTheme({
    palette: {
        type: "dark"
    },
});