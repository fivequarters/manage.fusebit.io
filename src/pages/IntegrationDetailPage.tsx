import React, { FC, ReactElement } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useAccountIntegrationsGetOne } from "../hooks/api/v2/account/integration/useGetOne";
import { useContext } from "../hooks/useContext";
import { Integration } from "../interfaces/integration";
import IntegrationDetail from "../components/IntegrationDetail";
import Navbar from "../components/Navbar";

const IntegrationDetailPage: FC<{}> = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useContext();
  const { data: integrationData } = useAccountIntegrationsGetOne<Integration>({ enabled: userData.token, id, accountId: userData.accountId, subscriptionId: userData.subscriptionId });

  return (
    <Layout>
      <Navbar sectionName={integrationData?.data.id || id} dropdown={true} integrationsLink={true} />
      <IntegrationDetail />
    </Layout>
  );
};

export default IntegrationDetailPage;
