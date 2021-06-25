import React, { FC, ReactElement } from "react";
import ConnectorDetail from "../components/ConnectorDetail";
import Navbar from "../components/Navbar";

const ConnectorDetailPage: FC<{}> = (): ReactElement => {
  return (
    <>
      <Navbar sectionName="Slack 1 Connector" dropdown={true} />
      <ConnectorDetail />
    </>
  );
};

export default ConnectorDetailPage;
