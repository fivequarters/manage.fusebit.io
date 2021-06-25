import React, { FC, ReactElement } from "react";
import ConnectorDetail from "../components/ConnectorDetail";
import Navbar from "../components/Navbar";

const ConnectorDetailPage: FC<{}> = (): ReactElement => {
  return (
    <>
      <Navbar sectionName="Slack Bot 1" dropdown={true} connector={true} />
      <ConnectorDetail />
    </>
  );
};

export default ConnectorDetailPage;
