import React, { FC, ReactElement } from "react";
import AuthenticationDetail from "../components/AuthenticationDetail/AuthenticationDetail";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";

const AuthenticationDetailPage: FC<{}> = (): ReactElement => {

  return (
    <Layout>
      <Navbar sectionName={"Authentication"} authentication={true} authenticationLink={true} />
      <AuthenticationDetail />
    </Layout>
  );
};

export default AuthenticationDetailPage;
