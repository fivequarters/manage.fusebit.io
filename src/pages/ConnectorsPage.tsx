import React, { FC, ReactElement } from "react";
import Connectors from "../components/Connectors";
import Navbar from "../components/Navbar";

const ConnectorsPage: FC<{}> = (): ReactElement => {
  return (
    <>
      <Navbar sectionName="Connectors" connector={true} />
      <Connectors />
    </>
  );
};

export default ConnectorsPage;
