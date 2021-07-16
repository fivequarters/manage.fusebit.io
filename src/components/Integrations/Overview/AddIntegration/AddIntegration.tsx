import React from "react";
import * as SC from "./styles";
import {Props} from "../../../../interfaces/addIntegration";
import {
    materialRenderers,
    materialCells
  } from '@jsonforms/material-renderers';
  import { JsonForms } from '@jsonforms/react';
  import { ValidationMode } from "@jsonforms/core";
  import { Button, Switch } from "@material-ui/core";
  import {feed} from "../../../../static/feed";
  import slack from "../../../../assets/slack.svg";

const AddIntegration: React.FC<Props> = ({open, onClose}) => {
    const [data, setData] = React.useState();
    const [errors, setErrors] = React.useState<object[]>([]);
    const [validationMode, setValidationMode] = React.useState<ValidationMode>("ValidateAndHide");
    const [customize, setCustomize] = React.useState(false);

    const handleSubmit = () => {
        if (errors.length > 0) {
            setValidationMode("ValidateAndShow");
        } else {
            alert("good");
        }
    }

    return (
        <SC.Card open={open}>
            <SC.Title>New Integration</SC.Title>
            <SC.Flex>
                <SC.Column>
                    <SC.ColumnItem active={true}>All</SC.ColumnItem>
                    <SC.ColumnItem active={false}>Messaging</SC.ColumnItem>
                </SC.Column>
                <SC.Column border={true}>
                    <SC.ColumnSearch placeholder="Search" />
                    <SC.ColumnItem active={true}>
                        <SC.ColumnItemImage src={slack} alt="slack" height="20" width="20" />
                        Slack
                    </SC.ColumnItem>
                    <SC.ColumnItem active={false}>
                        <SC.ColumnItemImage src={slack} alt="slack" height="20" width="20" />
                        Discord
                    </SC.ColumnItem>
                </SC.Column>
                <SC.ConnectorInfo>
                    <SC.ConnectorTitleWrapper>
                        <SC.ColumnItemImage src={slack} alt="slack" height="20" width="20" />
                        <SC.ConnectorTitle>Slack Connector</SC.ConnectorTitle>
                        <SC.ConnectorVersion>V1.0.0</SC.ConnectorVersion>
                    </SC.ConnectorTitleWrapper>
                    <SC.ConnectorDescription children={"This is a slack bot that _uses_ slack **and** Fusebit."} />
                    <SC.ConnectorCustomize>
                        Customize
                        <Switch checked={customize} onChange={() => setCustomize(!customize)} color="primary" inputProps={{ 'aria-label': 'customize' }} />
                    </SC.ConnectorCustomize>
                </SC.ConnectorInfo>
            </SC.Flex>
            {/* <SC.FormWrapper>
                <JsonForms
                schema={feed.configuration.schema}
                uischema={feed.configuration.uischema}
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
            </SC.FormWrapper> */}
        </SC.Card>
    )
}

export default AddIntegration;