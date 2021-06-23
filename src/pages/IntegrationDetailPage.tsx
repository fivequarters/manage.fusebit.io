import React, { FC, ReactElement } from "react";
import IntegrationDetail from "../components/IntegrationDetail";
import Navbar from "../components/Navbar";

const IntegrationDetailPage: FC<{}> = (): ReactElement => {
  return (
    <>
      <Navbar sectionName="Slack Bot 1 Integration" dropdown={true} />
      <IntegrationDetail />
    </>
  );
};

export default IntegrationDetailPage;
