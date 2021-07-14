import React from "react";
import TabComponent from "../TabComponent";
import Users from "./Users";

const Authentication: React.FC = () => {
    return (
        <>
            <TabComponent
            tabNames={["Users", "Clients"]}
            tabObjects={[<Users />, "Clients"]}
            />
        </>
    )
}

export default Authentication;