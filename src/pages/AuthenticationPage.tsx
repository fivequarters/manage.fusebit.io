import React, { FC, ReactElement } from "react";
import Authentication from "../components/Authentication/Authentication";
import Navbar from "../components/Navbar";

const AuthenticationPage: FC<{}> = (): ReactElement => {
  return (
    <>
      <Navbar sectionName="Authentication" />
      <Authentication />
    </>
  );
};

export default AuthenticationPage;
