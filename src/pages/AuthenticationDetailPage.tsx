import React, { FC, ReactElement } from "react";
import AuthenticationDetail from "../components/AuthenticationDetail/AuthenticationDetail";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import { useContext } from "../hooks/useContext";

const AuthenticationDetailPage: FC<{}> = (): ReactElement => {
  const { userData } = useContext();

  return (
    <Layout>
      <Navbar dropdown={true} sectionName={userData.primaryEmail || ""} authentication={true} authenticationLink={true} />
      <AuthenticationDetail />
    </Layout>
  );
};

export default AuthenticationDetailPage;
