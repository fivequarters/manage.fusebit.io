import React from "react"
import * as SC from "./styles";
import fusebit from "../../assets/fusebit-logo.svg";
import warning from "../../assets/warning-red.svg";
import { Button } from "@material-ui/core";
import { useAxios } from "../../hooks/useAxios";

const LoggedOutError: React.FC = () => {
    const { getBaseUrl } = useAxios();

    const handleAuth = () => {
        window.location.href = `https://fusebit.auth0.com/authorize?response_type=token&client_id=hSgWIXmbluQMADuWhDnRTpWyKptJe6LB&audience=${getBaseUrl()}&redirect_uri=${window.location.origin}/callback&scope=openid profile email`;
    }

    return (
        <SC.Wrapper>
            <SC.Background />
            <SC.Fusebit src={fusebit} alt="fusebit" height="37px" width="144px" />
            <SC.Warning src={warning} alt="warning" height="40" width="40" />
            <SC.Title>Logged out</SC.Title>
            <SC.Description>We have encountered an error, which requires that you log in to your account again.</SC.Description>
            <Button onClick={handleAuth} style={{width: "200px"}} variant="contained" color="primary" size="large">Log In</Button>
        </SC.Wrapper>
    )
}

export default LoggedOutError;