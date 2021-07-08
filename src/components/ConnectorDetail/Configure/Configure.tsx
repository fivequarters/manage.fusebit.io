import React from "react";
import { useParams } from "react-router-dom";
import * as SC from "./styles";
import { useAccountConnectorsGetOne } from "../../../hooks/api/v2/account/connector/useGetOne";
import { useContext } from "../../../hooks/useContext";
import { Connector } from "../../../interfaces/connector";

import { Button } from "@material-ui/core";
import arrow from "../../../assets/arrow-primary.svg";
import {
    materialRenderers,
    materialCells
  } from '@jsonforms/material-renderers';
  import { JsonForms } from '@jsonforms/react';
import { ValidationMode } from "@jsonforms/core";

//   const data = {
//     scope: "",
//     package: "@fusebit-int/pkg-oauth-connector",
//     clientId: "12345678",
//     tokenUrl: "https://app.asana.com/-/oauth_token",
//     clientSecret: "0987654321",
//     authorizationUrl: "https://app.asana.com/-/oauth_authorize",
//     refreshErrorLimit: 100000,
//     refreshInitialBackoff: 100000,
//     refreshWaitCountLimit: 100000,
//     refreshBackoffIncrement: 100000,
//     accessTokenExpirationBuffer: 500
//   }

  const schema = {
    type: "object",
    properties: {
        clientId: {
            title: "Client ID",
            type: "string",
            minLength: 8,
        },
        clientSecret: {
            type: "string",
            minLength: 8,
        },
        signingSecret: {
            type: "string",
            minLength: 8,
        },
    },
    required: ["clientId", "clientSecret", "signingSecret"]
  }

  const uischema = {
    type: "VerticalLayout",
    elements: [
      {
        type: "Control",
        scope: "#/properties/clientId",
        options: {
            hideRequiredAsterisk: true,
        }
      },
      {
        type: "Control",
        scope: "#/properties/clientSecret",
        options: {
            format: "password",
            hideRequiredAsterisk: true,
        }
      },
      {
        type: "Control",
        scope: "#/properties/signingSecret",
        options: {
            format: "password",
            hideRequiredAsterisk: true,
        }
      },
    ]
  }

const Configure: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { userData } = useContext();
    const { data: connectorData } = useAccountConnectorsGetOne<Connector>({ enabled: userData.token, id, accountId: userData.accountId, subscriptionId: userData.subscriptionId });
    const [data, setData] = React.useState();
    const [errors, setErrors] = React.useState<object[]>([]);
    const [validationMode, setValidationMode] = React.useState<ValidationMode>("ValidateAndHide");

    const handleSubmit = () => {
        if (errors.length > 0) {
            setValidationMode("ValidateAndShow");
        } else {
            alert("good");
        }
    }

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
                    <JsonForms
                    schema={schema}
                    uischema={uischema}
                    data={data}
                    renderers={materialRenderers}
                    cells={materialCells}
                    onChange={({ errors, data }) => {
                        errors && setErrors(errors);
                        setData(data);
                    }}
                    validationMode={validationMode}
                    />
                    <SC.FormInputWrapper>
                        <Button onClick={handleSubmit} style={{width: "200px"}} fullWidth={false} size="large" color="primary" variant="contained">Save</Button>
                    </SC.FormInputWrapper>
                </SC.FormWrapper>
                </SC.FlexDown>
           </SC.Flex>
    )
}

export default Configure;