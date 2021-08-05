import React from "react";
import TabComponent from "../TabComponent";
import Users from "./Users";

const Authentication: React.FC = () => {
    return (
        <>
            <TabComponent
            tabNames={["Users"]}
            tabObjects={[<Users />]}
            />
        </>
    )
}

export default Authentication;