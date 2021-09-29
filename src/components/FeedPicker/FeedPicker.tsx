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
import { useReplaceMustache } from '../../hooks/useReplaceMustache';
import { trackEvent } from '../../utils/analytics';
import debounce from 'lodash.debounce';

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
  const [rawActiveTemplate, setRawActiveTemplate] = React.useState<Feed>();
  const [searchFilter, setSearchFilter] = React.useState('');
  const query = useQuery();
  const { replaceMustache } = useReplaceMustache();

  const debouncedSetSearchFilter = debounce((keyword: string) => {
    if (isIntegration) {
      trackEvent('New Integration Search Submitted', 'Integrations');
    } else {
      trackEvent('New Connector Search Submitted', 'Connectors');
    }
    setSearchFilter(keyword);
  }, 500);

  const handleSubmit = () => {
    if (errors.length > 0) {
      setValidationMode('ValidateAndShow');
    } else {
      //normalize data
      const keys = Object.keys(data);
      for (let i = 0; keys.length > i; i++) {
        const id: any = data[keys[i]].id;
        if (typeof id === 'string') {
          data[keys[i]].id = id.replace(/\s/g, '');
        }
      }

      //send data with customized form
      onSubmit(rawActiveTemplate, { ...data });
    }
  };

  const handleFilterChange = (filter: Filters) => {
    setActiveFilter(filter);
  };

  useEffect(() => {
    const key = query.get('key');

    (isIntegration ? integrationsFeed() : connectorsFeed()).then((feed) => {
      setFeed(feed);
      for (let i = 0; i < feed.length; i++) {
        if (feed[i].id === key) {
          replaceMustache(data, feed[i]).then((template) => setActiveTemplate(template));
          return;
        }
      }

      setRawActiveTemplate(feed[0]);
      replaceMustache(data, feed[0]).then((template) => {
        setActiveTemplate(template);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntegration]);

  const feedTypeName = isIntegration ? 'Integration' : 'Connector';

  const handleTemplateChange = (template: Feed) => {
    if (isIntegration) {
      trackEvent(`New Integration Catalog ${template.name} Clicked`, 'Integrations');
    } else {
      trackEvent(`New Connector Catalog ${template.name} Clicked`, 'Connectors');
    }
    setRawActiveTemplate(template);
    replaceMustache(data, template).then((template) => {
      setActiveTemplate(template);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <SC.Card onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e)} open={open}>
      <SC.Close onClick={() => onClose()} src={cross} alt="close" height="12" width="12" />
      <SC.Title>{`New ${feedTypeName}`}</SC.Title>
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
              style={{ width: '100%' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => debouncedSetSearchFilter(e.target.value)}
              label="Search"
            />
            <SC.ColumnSearchIcon src={search} alt={`Search ${feedTypeName}`} height="24" width="24" />
          </SC.ColumnSearchWrapper>
          {feed.map((feedEntry: Feed) => {
            const tags = feedEntry.tags.catalog.split(',');
            let tagIsActive = false;
            tags.forEach((tag: string) => {
              if (activeFilter.toUpperCase().match(tag.toUpperCase()) || activeFilter === Filters.ALL) {
                tagIsActive = true;
              }
            });
            if (tagIsActive && feedEntry.name.toUpperCase().includes(searchFilter.toUpperCase())) {
              return (
                <SC.ColumnItem
                  key={feedEntry.id}
                  onClick={() => handleTemplateChange(feedEntry)}
                  active={feedEntry.id === activeTemplate?.id}
                >
                  <SC.ColumnItemImage src={feedEntry.smallIcon} alt="slack" height="18" width="18" />
                  {feedEntry.name}
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
          <SC.GeneralInfoWrapper>
            <SC.ConnectorDescription children={activeTemplate?.description || ''} />
            <SC.FormWrapper>
              <JsonForms
                schema={activeTemplate?.configuration.schema}
                uischema={activeTemplate?.configuration.uischema}
                data={data}
                renderers={materialRenderers}
                cells={materialCells}
                onChange={({ errors, data }) => {
                  if (data?.ui?.toggle && activeTemplate) {
                    trackEvent(`New Integration Customize ${activeTemplate.name} Clicked`, 'Integrations');
                  }
                  errors && setErrors(errors);
                  setData(data);
                }}
                validationMode={validationMode}
              />
            </SC.FormWrapper>
          </SC.GeneralInfoWrapper>
          <SC.MobileHidden>
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
          </SC.MobileHidden>
          <SC.MobileVisible>
            <Button
              onClick={handleSubmit}
              style={{ width: '200px', margin: 'auto' }}
              fullWidth={false}
              size="large"
              color="primary"
              variant="contained"
            >
              Create
            </Button>
          </SC.MobileVisible>
        </SC.ConnectorInfo>
      </SC.Flex>
    </SC.Card>
  );
});

export default FeedPicker;
