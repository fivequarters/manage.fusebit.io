import React from "react";
import TabComponent from "../TabComponent";
import Develop from "./Develop";

const IntegrationDetail: React.FC = () => {
    return (
        <TabComponent 
        tabNames={["Develop", "Installs"]}
        tabObjects={[<Develop />, "Installs"]}
        />
    )
}

export default IntegrationDetail;