import React from "react";
import * as SC from "./styles";
import { Button } from "@material-ui/core";

const Identities: React.FC = () => {
    return (
        <SC.Wrapper>
            <SC.Header>Total Identities: 20</SC.Header>
            <Button style={{width: "200px"}} variant="contained" color="primary" size="large">Delete all Identities</Button>
        </SC.Wrapper>
    )
}

export default Identities;