import React, { FC, ReactElement } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";

// define css-in-js
const useStyles = makeStyles(_ =>
  createStyles({
    root: {
      flex: 1,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
  })
);

const Home: FC<{}> = (): ReactElement => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        Hello World!
      </div>
    </>
  );
};

export default Home;
