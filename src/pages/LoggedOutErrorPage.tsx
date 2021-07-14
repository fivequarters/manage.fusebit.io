import React, { FC, ReactElement } from "react";
import LoggedOutError from "../components/LoggedOutError/LoggedOutError";

const LoggedOutErrorPage: FC<{}> = (): ReactElement => {
  return (
    <>
      <LoggedOutError />
    </>
  );
};

export default LoggedOutErrorPage;
