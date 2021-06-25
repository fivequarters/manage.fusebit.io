import React from "react";
import TabComponent from "../TabComponent";
import Configure from "./Configure";

const ConnectorDetail: React.FC = () => {
    return (
        <TabComponent 
        tabNames={["Configure", "Identities", "Analytics", "Deployments"]} 
        tabObjects={[<Configure />, "Identities", "Analytics", "Deployments"]}
        />
    )
}

export default ConnectorDetail;