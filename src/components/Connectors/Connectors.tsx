import React, { useRef } from "react";
import TabComponent from "../TabComponent";
import Overview from "./Overview";

const Connectors: React.FC = () => {
    let headless = useRef(true); // the parent has to have this otherwise the mounting of the overview will open the feed picker if there is a query param.
    return (
        <TabComponent
        tabNames={["Overview", "Health", "Analytics"]}
        tabObjects={[<Overview headless={headless} setHeadless={(value: boolean) => headless.current = value} />, "Health", "Analytics"]}
        />
    )
}

export default Connectors;