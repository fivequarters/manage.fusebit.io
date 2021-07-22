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
  import search from "../../../../assets/search.svg";
  import cross from "../../../../assets/cross.svg";
import { Feed } from "../../../../interfaces/feed";

  enum Filters {
      ALL = "All",
      MESSAGGING = "Messaging",
      PRODUCTIVITY = "Productivity",
      CRM = "CRM",
      CALENDAR = "Calendar",
  }

const AddIntegration: React.FC<Props> = ({open, onClose, onSubmit}) => {
    const [data, setData] = React.useState<any>({});
    const [errors, setErrors] = React.useState<object[]>([]);
    const [validationMode, setValidationMode] = React.useState<ValidationMode>("ValidateAndHide");
    const [customize, setCustomize] = React.useState(false);
    const [activeFilter, setActiveFilter] = React.useState<Filters>(Filters.ALL);
    const [activeIntegration, setActiveIntegration] = React.useState<Feed>(integrationsFeed[0]);
    const [searchFilter, setSearchFilter] = React.useState("");
    const [newIntegrationName, setNewIntergationName] = React.useState("");
    const [newIntegrationNameErr, setNewIntegrationNameErr] = React.useState("");

    const handleSubmit = () => {
        if (errors.length > 0 || newIntegrationName === "") {
            setValidationMode("ValidateAndShow");
            newIntegrationName === "" && setNewIntegrationNameErr("This field is required");
        } else if (customize) {
            //send data with customized form
            onSubmit(activeIntegration, {...data, newIntegrationName});
        } else {
            //send data with default form
            onSubmit(activeIntegration, {newIntegrationName});
        }
    }

    const handleFilterChange = (filter: Filters) => {
        setActiveFilter(filter);
    }

    return (
        <SC.Card open={open}>
            <SC.Close onClick={() => onClose()} src={cross} alt="close" height="12" width="12" />
            <SC.Title>New Integration</SC.Title>
            <SC.Flex>
                <SC.Column>
                    <SC.ColumnItem onClick={() => handleFilterChange(Filters.ALL)} active={activeFilter === Filters.ALL}>{Filters.ALL}</SC.ColumnItem>
                    <SC.ColumnItem onClick={() => handleFilterChange(Filters.MESSAGGING)} active={activeFilter === Filters.MESSAGGING}>{Filters.MESSAGGING}</SC.ColumnItem>
                    <SC.ColumnItem onClick={() => handleFilterChange(Filters.PRODUCTIVITY)} active={activeFilter === Filters.PRODUCTIVITY}>{Filters.PRODUCTIVITY}</SC.ColumnItem>
                    <SC.ColumnItem onClick={() => handleFilterChange(Filters.CRM)} active={activeFilter === Filters.CRM}>{Filters.CRM}</SC.ColumnItem>
                    <SC.ColumnItem onClick={() => handleFilterChange(Filters.CALENDAR)} active={activeFilter === Filters.CALENDAR}>{Filters.CALENDAR}</SC.ColumnItem>
                </SC.Column>
                <SC.ColumnBr />
                <SC.Column border={true}>
                    <SC.ColumnSearchWrapper>
                        <SC.ColumnSearch onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFilter(e.target.value)} placeholder="Search" />
                        <SC.ColumnSearchIcon src={search} alt="Search Integration" height="24" width="24" />
                    </SC.ColumnSearchWrapper>
                    {
                            integrationsFeed.map((integration: Feed) => {
                                const tags = integration.tags.catalog.split(", ");
                                let tagIsActive = false;
                                tags.forEach((tag: string) => {
                                    if (activeFilter.toUpperCase().match(tag.toUpperCase()) || activeFilter === Filters.ALL) {
                                        tagIsActive = true;
                                    }
                                });
                                if (tagIsActive && integration.name.toUpperCase().includes(searchFilter.toUpperCase())) {
                                    return (
                                        <SC.ColumnItem key={integration.id} onClick={() => setActiveIntegration(integration)} active={integration.id === activeIntegration.id}>
                                            <SC.ColumnItemImage src={integration.smallIcon} alt="slack" height="18" width="18" />
                                            {integration.name}
                                        </SC.ColumnItem>
                                    )
                                }
                                return null;
                            })
                    }
                </SC.Column>
                <SC.ColumnBr />
                <SC.ConnectorInfo>
                    <SC.ConnectorTitleWrapper>
                        <SC.ConnectorImage src={activeIntegration.smallIcon} alt="slack" height="28" width="28" />
                        <SC.ConnectorTitle>{activeIntegration.name}</SC.ConnectorTitle>
                        <SC.ConnectorVersion>{activeIntegration.version}</SC.ConnectorVersion>
                    </SC.ConnectorTitleWrapper>
                    <SC.ConnectorDescription children={activeIntegration.description} />
                    <SC.TextFielWrapper>
                        <TextField onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setNewIntergationName(e.target.value);
                            setNewIntegrationNameErr("");
                            }} 
                            id="name" 
                            label="Name" 
                            style={{margin: "27px 0", width: "320px"}} 
                        />
                        {newIntegrationNameErr !== "" && <SC.Error>{newIntegrationNameErr}</SC.Error>}
                    </SC.TextFielWrapper>
                    <SC.ConnectorCustomize>
                        Customize
                        <Switch checked={customize} onChange={() => setCustomize(!customize)} color="primary" inputProps={{ 'aria-label': 'customize' }} />
                    </SC.ConnectorCustomize>
                    {
                        customize && (
                            <SC.FormWrapper>
                                <JsonForms
                                schema={activeIntegration.configuration.schema}
                                uischema={activeIntegration.configuration.uischema.elements}
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