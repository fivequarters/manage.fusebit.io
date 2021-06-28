import React from "react";
import TabComponent from "../TabComponent";
import Overview from "./Overview";

const Integrations: React.FC = () => {
    return (
        <TabComponent
        tabNames={["Overview", "Health", "Analytics"]}
        tabObjects={[<Overview />, "Health", "Analytics"]}
        />
    )
}

export default Integrations;