import React from "react";
import TabComponent from "../TabComponent";
import Overview from "./Overview";

const AuthenticationDetail: React.FC = () => {
    return (
        <>
            <TabComponent
            tabNames={["Overview", "Permissions"]}
            tabObjects={[<Overview />, "Permissions"]}
            />
        </>
    )
}

export default AuthenticationDetail;