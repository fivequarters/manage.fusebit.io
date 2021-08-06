import React, { useRef } from "react";
import TabComponent from "../TabComponent";
import Overview from "./Overview";
import Installs from "./Installs";

const Integrations: React.FC = () => {
    let headless = useRef(true); // the parent has to have this otherwise the mounting of the overview will open the feed picker if there is a query param.

    return (
        <TabComponent
        tabNames={["Overview", "Installs"]}
        tabObjects={[<Overview headless={headless} setHeadless={(value: boolean) => headless.current = value} />, <Installs />]}
        />
    )
}

export default Integrations;