import React, { FC, ReactElement } from "react";
import Layout from "../components/Layout";
import LoggedOutError from "../components/LoggedOutError/LoggedOutError";

const LoggedOutErrorPage: FC<{}> = (): ReactElement => {
  return (
    <Layout>
      <LoggedOutError />
    </Layout>
  );
};

export default LoggedOutErrorPage;
