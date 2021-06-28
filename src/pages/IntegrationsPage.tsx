import React, { FC, ReactElement } from "react";
import Integrations from "../components/Integrations";
import Navbar from "../components/Navbar";

const IntegrationsPage: FC<{}> = (): ReactElement => {
  return (
    <>
      <Navbar sectionName="Integrations" />
      <Integrations />
    </>
  );
};

export default IntegrationsPage;
