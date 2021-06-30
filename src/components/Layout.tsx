import React, { FC, ReactNode } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import GlobalStyle from "./globalStyle";

const useStyles = makeStyles(_ =>
  createStyles({
    root: {
      flex: 1,
      display: "flex",
      flexDirection: "column"
    }
  })
);

interface Props {
  children: ReactNode;
}

// functional component
const Layout: FC<Props> = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <GlobalStyle />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
