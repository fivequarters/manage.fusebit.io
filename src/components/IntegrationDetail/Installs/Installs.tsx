import React from "react";
import * as SC from "./styles";
import { Button } from "@material-ui/core";

const Installs: React.FC = () => {
    return (
        <SC.Wrapper>
            <SC.Header>Total Installs: 20</SC.Header>
            <Button style={{width: "200px"}} variant="contained" color="primary" size="large">Delete all installs</Button>
        </SC.Wrapper>
    )
}

export default Installs;