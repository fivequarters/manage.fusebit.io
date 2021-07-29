import React, { FC, ReactElement } from "react";
import Authentication from "../components/Authentication/Authentication";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";

const AuthenticationPage: FC<{}> = (): ReactElement => {
  return (
    <Layout>
      <Navbar sectionName="Authentication" authenticationLink={true} authentication={true} />
      <Authentication />
    </Layout>
  );
};

export default AuthenticationPage;
