import React from "react";
import { useParams } from "react-router-dom";
import * as SC from "./styles";
import { useAccountConnectorsGetOne } from "../../../hooks/api/v2/account/connector/useGetOne";
import { useContext } from "../../../hooks/useContext";
import { Connector } from "../../../interfaces/connector";

import { TextField, Button } from "@material-ui/core";
import arrow from "../../../assets/arrow-primary.svg";

const Configure: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { userData } = useContext();
    const { data: connectorData } = useAccountConnectorsGetOne<Connector>({ enabled: userData.token, id, accountId: userData.accountId, subscriptionId: userData.subscriptionId });

    return (
           <SC.Flex>
                <SC.FlexDown>
                    <SC.InfoWrapper>
                        <SC.InfoTitle>ID:</SC.InfoTitle>
                        <SC.InfoDescription>{connectorData?.data.id}</SC.InfoDescription>
                    </SC.InfoWrapper>
                    <SC.InfoWrapper>
                        <SC.InfoTitle>Slack app:</SC.InfoTitle>
                        <SC.InfoLink href="/">
                            Acme Chatbot
                            <img src={arrow} alt="arrow" height="16" width="16" />
                            </SC.InfoLink>
                    </SC.InfoWrapper>
                </SC.FlexDown>
                <SC.FlexDown>
                    <SC.FormWrapper>
                        <SC.FormInputWrapper>
                            <TextField style={{width: "316px"}} color="primary" id="clientId" label="Client ID" variant="outlined" />
                        </SC.FormInputWrapper>
                        <SC.FormInputWrapper>
                            <TextField style={{width: "316px"}} type="password" color="primary" id="clientSecret" label="Client Secret" variant="outlined" />
                        </SC.FormInputWrapper>
                        <SC.FormInputWrapper>
                            <TextField style={{width: "316px"}} type="password" color="primary" id="signingSecret" label="Signing Secret" variant="outlined" />
                        </SC.FormInputWrapper>
                        <Button style={{width: "200px"}} fullWidth={false} size="large" color="primary" variant="contained">Save</Button>
                    </SC.FormWrapper>
                </SC.FlexDown>
           </SC.Flex>
    )
}

export default Configure;