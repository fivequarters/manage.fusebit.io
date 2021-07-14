import React, { FC, ReactElement } from "react";
import FatalError from "../components/FatalError";
import Navbar from "../components/Navbar";

const LoggedOutErrorPage: FC<{}> = (): ReactElement => {
  return (
    <>
      <Navbar sectionName={""} dropdown={true} integrationsLink={true} />
      <FatalError />
    </>
  );
};

export default LoggedOutErrorPage;
