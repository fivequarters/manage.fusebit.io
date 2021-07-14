import React, { FC, ReactElement } from "react";
import Layout from "../components/Layout";
import Integrations from "../components/Integrations";
import Navbar from "../components/Navbar";

const IntegrationsPage: FC<{}> = (): ReactElement => {
  return (
    <Layout>
      <Navbar dropdown={true} sectionName="Integrations" integration={true} />
      <Integrations />
    </Layout>
  );
};

export default IntegrationsPage;
