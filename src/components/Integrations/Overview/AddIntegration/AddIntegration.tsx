import React from "react";
import * as SC from "./styles";
import {Props} from "../../../../interfaces/addIntegration";
import {
    materialRenderers,
    materialCells
  } from '@jsonforms/material-renderers';
  import { JsonForms } from '@jsonforms/react';
  import { ValidationMode } from "@jsonforms/core";
  import { Button, Switch, TextField } from "@material-ui/core";
  import {integrationsFeed} from "../../../../static/feed";
  import slack from "../../../../assets/slack.svg";
  import search from "../../../../assets/search.svg";
  import cross from "../../../../assets/cross.svg";

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
            <SC.Close onClick={() => onClose()} src={cross} alt="close" height="12" width="12" />
            <SC.Title>New Integration</SC.Title>
            <SC.Flex>
                <SC.Column>
                    <SC.ColumnItem active={true}>All</SC.ColumnItem>
                    <SC.ColumnItem active={false}>Messaging</SC.ColumnItem>
                    <SC.ColumnItem active={false}>Productivity</SC.ColumnItem>
                    <SC.ColumnItem active={false}>CRM</SC.ColumnItem>
                    <SC.ColumnItem active={false}>Calendar</SC.ColumnItem>
                </SC.Column>
                <SC.ColumnBr />
                <SC.Column border={true}>
                    <SC.ColumnSearchWrapper>
                        <SC.ColumnSearch placeholder="Search" />
                        <SC.ColumnSearchIcon src={search} alt="Search Integration" height="24" width="24" />
                    </SC.ColumnSearchWrapper>
                    <SC.ColumnItem active={true}>
                        <SC.ColumnItemImage src={slack} alt="slack" height="18" width="18" />
                        Slack
                    </SC.ColumnItem>
                    <SC.ColumnItem active={false}>
                        <SC.ColumnItemImage src={slack} alt="slack" height="18" width="18" />
                        Discord
                    </SC.ColumnItem>
                </SC.Column>
                <SC.ColumnBr />
                <SC.ConnectorInfo>
                    <SC.ConnectorTitleWrapper>
                        <SC.ConnectorImage src={slack} alt="slack" height="28" width="28" />
                        <SC.ConnectorTitle>Slack Connector</SC.ConnectorTitle>
                        <SC.ConnectorVersion>V1.0.0</SC.ConnectorVersion>
                    </SC.ConnectorTitleWrapper>
                    <SC.ConnectorDescription children={"This is a slack bot that _uses_ slack **and** Fusebit."} />
                    <TextField id="name" label="Name" style={{margin: "27px 0", width: "320px"}} />
                    <SC.ConnectorCustomize>
                        Customize
                        <Switch checked={customize} onChange={() => setCustomize(!customize)} color="primary" inputProps={{ 'aria-label': 'customize' }} />
                    </SC.ConnectorCustomize>
                    {
                        customize && (
                            <SC.FormWrapper>
                                <JsonForms
                                schema={integrationsFeed.configuration.schema.properties.slackConnector}
                                uischema={integrationsFeed.configuration.uischema.elements}
                                data={data}
                                renderers={materialRenderers}
                                cells={materialCells}
                                onChange={({ errors, data }) => {
                                    errors && setErrors(errors);
                                    setData(data);
                                }}
                                validationMode={validationMode}
                                />
                            </SC.FormWrapper>
                        )
                    }
                    
                        <Button onClick={handleSubmit} style={{width: "200px", marginTop: "auto", marginLeft: "auto"}} fullWidth={false} size="large" color="primary" variant="contained">Create</Button>
                </SC.ConnectorInfo>
            </SC.Flex>
        </SC.Card>
    )
}

export default AddIntegration;