import React from 'react';
import * as SC from './styles';
import { Props } from '../../interfaces/feedPicker';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { ValidationMode } from '@jsonforms/core';
import { Button, TextField } from '@material-ui/core';
import { integrationsFeed, connectorsFeed } from '../../static/feed';
import search from '../../assets/search.svg';
import cross from '../../assets/cross.svg';
import { Feed } from '../../interfaces/feed';
import { useState } from 'react';
import { useEffect } from 'react';
import { useQuery } from '../../hooks/useQuery';

enum Filters {
  ALL = 'All',
  MESSAGGING = 'Messaging',
  PRODUCTIVITY = 'Productivity',
  CRM = 'CRM',
  CALENDAR = 'Calendar',
}

const FeedPicker = React.forwardRef(({ open, onClose, onSubmit, isIntegration }: Props, ref) => {
  const [data, setData] = React.useState<any>({});
  const [errors, setErrors] = React.useState<object[]>([]);
  const [validationMode, setValidationMode] = React.useState<ValidationMode>('ValidateAndHide');
  const [activeFilter, setActiveFilter] = React.useState<Filters>(Filters.ALL);
  const [feed, setFeed] = useState<Feed[]>([]);
  const [activeTemplate, setActiveTemplate] = React.useState<Feed>();
  const [searchFilter, setSearchFilter] = React.useState('');
  const query = useQuery();

  const handleSubmit = () => {
    if (errors.length > 0) {
      setValidationMode('ValidateAndShow');
    } else {
      //send data with customized form
      onSubmit(activeTemplate, { ...data });
    }
  };

  const handleFilterChange = (filter: Filters) => {
    setActiveFilter(filter);
  };

  useEffect(() => {
    const key = query.get('key');

    if (isIntegration) {
      integrationsFeed().then((feed) => {
        setFeed(feed);
        let keyDoesntMatch = true;
        for (let i = 0; i < feed.length; i++) {
          if (feed[i].id === key) {
            keyDoesntMatch = false;
            setActiveTemplate(feed[i]);
          }
        }
        keyDoesntMatch && setActiveTemplate(feed[0]);
      });
    } else {
      connectorsFeed().then((feed) => {
        setFeed(feed);
        let keyDoesntMatch = true;
        for (let i = 0; i < feed.length; i++) {
          if (feed[i].id === key) {
            keyDoesntMatch = false;
            setActiveTemplate(feed[i]);
          }
        }
        keyDoesntMatch && setActiveTemplate(feed[0]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntegration]);

  return (
    <SC.Card open={open}>
      <SC.Close onClick={() => onClose()} src={cross} alt="close" height="12" width="12" />
      <SC.Title>{isIntegration ? 'New Integration' : 'New Connector'}</SC.Title>
      <SC.Flex>
        <SC.Column>
          <SC.ColumnItem onClick={() => handleFilterChange(Filters.ALL)} active={activeFilter === Filters.ALL}>
            {Filters.ALL}
          </SC.ColumnItem>
          <SC.ColumnItem
            onClick={() => handleFilterChange(Filters.MESSAGGING)}
            active={activeFilter === Filters.MESSAGGING}
          >
            {Filters.MESSAGGING}
          </SC.ColumnItem>
          <SC.ColumnItem
            onClick={() => handleFilterChange(Filters.PRODUCTIVITY)}
            active={activeFilter === Filters.PRODUCTIVITY}
          >
            {Filters.PRODUCTIVITY}
          </SC.ColumnItem>
          <SC.ColumnItem onClick={() => handleFilterChange(Filters.CRM)} active={activeFilter === Filters.CRM}>
            {Filters.CRM}
          </SC.ColumnItem>
          <SC.ColumnItem
            onClick={() => handleFilterChange(Filters.CALENDAR)}
            active={activeFilter === Filters.CALENDAR}
          >
            {Filters.CALENDAR}
          </SC.ColumnItem>
        </SC.Column>
        <SC.ColumnBr />
        <SC.Column border={true}>
          <SC.ColumnSearchWrapper>
            <TextField
              style={{ width: '254px' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFilter(e.target.value)}
              label="Search"
            />
            <SC.ColumnSearchIcon src={search} alt="Search Integration" height="24" width="24" />
          </SC.ColumnSearchWrapper>
          {feed.map((integration: Feed) => {
            const tags = integration.tags.catalog.split(', ');
            let tagIsActive = false;
            tags.forEach((tag: string) => {
              if (activeFilter.toUpperCase().match(tag.toUpperCase()) || activeFilter === Filters.ALL) {
                tagIsActive = true;
              }
            });
            if (tagIsActive && integration.name.toUpperCase().includes(searchFilter.toUpperCase())) {
              return (
                <SC.ColumnItem
                  key={integration.id}
                  onClick={() => setActiveTemplate(integration)}
                  active={integration.id === activeTemplate?.id}
                >
                  <SC.ColumnItemImage src={integration.smallIcon} alt="slack" height="18" width="18" />
                  {integration.name}
                </SC.ColumnItem>
              );
            } else {
              return null;
            }
          })}
        </SC.Column>
        <SC.ColumnBr />
        <SC.ConnectorInfo>
          <SC.ConnectorTitleWrapper>
            <SC.ConnectorImage src={activeTemplate?.smallIcon} alt="slack" height="28" width="28" />
            <SC.ConnectorTitle>{activeTemplate?.name}</SC.ConnectorTitle>
            <SC.ConnectorVersion>{activeTemplate?.version}</SC.ConnectorVersion>
          </SC.ConnectorTitleWrapper>
          <SC.ConnectorDescription children={activeTemplate?.description || ''} />
          <SC.FormWrapper>
            <JsonForms
              schema={activeTemplate?.configuration.schema}
              uischema={activeTemplate?.configuration.uischema.elements}
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
          <Button
            onClick={handleSubmit}
            style={{ width: '200px', marginTop: 'auto', marginLeft: 'auto' }}
            fullWidth={false}
            size="large"
            color="primary"
            variant="contained"
          >
            Create
          </Button>
        </SC.ConnectorInfo>
      </SC.Flex>
    </SC.Card>
  );
});

export default FeedPicker;
