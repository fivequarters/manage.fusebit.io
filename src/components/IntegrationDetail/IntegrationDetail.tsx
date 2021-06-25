import React from "react";
import TabComponent from "../TabComponent";
import Develop from "./Develop";

const IntegrationDetail: React.FC = () => {
    return (
        <TabComponent 
        tabNames={["Develop", "Installs", "Configuration", "Health", "Analytics", "Deployments"]}
        tabObjects={[<Develop />, "Installs", "Configuration", "Health", "Analytics", "Deployments"]}
        />
    )
}

export default IntegrationDetail;