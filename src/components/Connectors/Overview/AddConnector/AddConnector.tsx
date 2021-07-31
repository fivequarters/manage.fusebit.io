import React, { useEffect, useState } from "react";
import * as SC from "./styles";
import {Props} from "../../../../interfaces/addIntegration";
import {
    materialRenderers,
    materialCells
  } from '@jsonforms/material-renderers';
  import { JsonForms } from '@jsonforms/react';
  import { ValidationMode } from "@jsonforms/core";
  import { Button, TextField } from "@material-ui/core";
  import {connectorsFeed} from "../../../../static/feed";
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

const AddConnector: React.FC<Props> = ({open, onClose, onSubmit}) => {
    const [data, setData] = React.useState<any>({});
    const [errors, setErrors] = React.useState<any[]>([]);
    const [validationMode, setValidationMode] = React.useState<ValidationMode>("ValidateAndHide");
    const [activeFilter, setActiveFilter] = React.useState<Filters>(Filters.ALL);
    const [feed, setFeed] = useState<Feed[]>([]);
    const [activeConnector, setActiveConnector] = React.useState<Feed>();
    const [searchFilter, setSearchFilter] = React.useState("");

    const handleSubmit = () => {
        if (errors.length > 0) {
            setValidationMode("ValidateAndShow");
        } else {
            //send data with customized form
            onSubmit(activeConnector, {...data});
        }
    }

    const handleFilterChange = (filter: Filters) => {
        setActiveFilter(filter);
    }

    useEffect(() => {
        connectorsFeed().then(feed => {
            setFeed(feed);
            setActiveConnector(feed[0])
        })
    }, [])

    return (
        <SC.Card open={open}>
            <SC.Close onClick={() => onClose()} src={cross} alt="close" height="12" width="12" />
            <SC.Title>New Connector</SC.Title>
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
                        <TextField style={{width: "254px"}} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFilter(e.target.value)} label="Search" />
                        <SC.ColumnSearchIcon src={search} alt="Search Connector" height="24" width="24" />
                    </SC.ColumnSearchWrapper>
                    {
                            feed.map((Connector: Feed) => {
                                const tags = Connector.tags.catalog.split(", ");
                                let tagIsActive = false;
                                tags.forEach((tag: string) => {
                                    if (activeFilter.toUpperCase().match(tag.toUpperCase()) || activeFilter === Filters.ALL) {
                                        tagIsActive = true;
                                    }
                                });
                                if (tagIsActive && Connector.name.toUpperCase().includes(searchFilter.toUpperCase())) {
                                    return (
                                        <SC.ColumnItem key={Connector.id} onClick={() => setActiveConnector(Connector)} active={Connector.id === activeConnector?.id}>
                                            <SC.ColumnItemImage src={Connector.smallIcon} alt="slack" height="18" width="18" />
                                            {Connector.name}
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
                        <SC.ConnectorImage src={activeConnector?.smallIcon} alt="slack" height="28" width="28" />
                        <SC.ConnectorTitle>{activeConnector?.name}</SC.ConnectorTitle>
                        <SC.ConnectorVersion>{activeConnector?.version}</SC.ConnectorVersion>
                    </SC.ConnectorTitleWrapper>
                    <SC.ConnectorDescription children={activeConnector?.description || ""} />
                    <SC.FormWrapper>
                        <JsonForms
                        schema={activeConnector?.configuration.schema}
                        uischema={activeConnector?.configuration.uischema.elements}
                        data={data}
                        renderers={materialRenderers}
                        cells={materialCells}
                        onChange={({ errors, data }) => {
                            errors && setErrors(errors);
                            console.log(errors);
                            setData(data);
                        }}
                        validationMode={validationMode}
                        />
                    </SC.FormWrapper>
                    <Button onClick={handleSubmit} style={{width: "200px", marginTop: "auto", marginLeft: "auto"}} fullWidth={false} size="large" color="primary" variant="contained">Create</Button>
                </SC.ConnectorInfo>
            </SC.Flex>
        </SC.Card>
    )
}

export default AddConnector;