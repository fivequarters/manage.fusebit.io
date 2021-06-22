import { createMuiTheme, Theme } from '@material-ui/core/styles';

export const lightTheme: Theme = createMuiTheme({
    palette: {
        type: "light"
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