import React, { useState, useEffect } from 'react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { ValidationMode } from '@jsonforms/core';
import { Button, TextField } from '@material-ui/core';
import debounce from 'lodash.debounce';
import * as SC from './styles';
import { Props } from '../../interfaces/feedPicker';
import { integrationsFeed, connectorsFeed } from '../../static/feed';
import search from '../../assets/search.svg';
import cross from '../../assets/cross.svg';
import { Feed } from '../../interfaces/feed';

import { useQuery } from '../../hooks/useQuery';
import { useReplaceMustache } from '../../hooks/useReplaceMustache';
import { trackEvent } from '../../utils/analytics';
import Loader from '../Loader';

enum Filters {
  ALL = 'All',
  MESSAGGING = 'Messaging',
  PRODUCTIVITY = 'Productivity',
  CRM = 'CRM',
  CALENDAR = 'Calendar',
}

const FeedPicker = React.forwardRef<HTMLDivElement, Props>(({ open, onClose, onSubmit, isIntegration }, ref) => {
  const [data, setData] = React.useState<any>({});
  const [errors, setErrors] = React.useState<object[]>([]);
  const [validationMode, setValidationMode] = React.useState<ValidationMode>('ValidateAndHide');
  const [activeFilter, setActiveFilter] = React.useState<Filters>(Filters.ALL);
  const [feed, setFeed] = useState<Feed[]>([]);
  const [activeTemplate, setActiveTemplate] = React.useState<Feed>();
  const [rawActiveTemplate, setRawActiveTemplate] = React.useState<Feed>();
  const [searchFilter, setSearchFilter] = React.useState('');
  const [loading, setLoading] = React.useState(true);
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
      // normalize data
      const keys = Object.keys(data);
      for (let i = 0; keys.length > i; i++) {
        const { id } = data[keys[i]];
        if (typeof id === 'string') {
          data[keys[i]].id = id.replace(/\s/g, '');
        }
      }

      // send data with customized form
      onSubmit(rawActiveTemplate, { ...data });
    }
  };

  const handleFilterChange = (filter: Filters) => {
    if (isIntegration) {
      trackEvent('New Integration Catalog Clicked', 'Integrations', { tag: filter });
    } else {
      trackEvent('New Connector Catalog Clicked', 'Connectors', { tag: filter });
    }
    setActiveFilter(filter);
  };

  const feedTypeName = isIntegration ? 'Integration' : 'Connector';

  useEffect(() => {
    const key = query.get('key');

    (isIntegration ? integrationsFeed() : connectorsFeed()).then((_feed) => {
      setFeed(_feed);
      setLoading(false);
      for (let i = 0; i < _feed.length; i++) {
        if (_feed[i].id === key) {
          replaceMustache(data, _feed[i]).then((template) => setActiveTemplate(template));
          return;
        }
      }

      setRawActiveTemplate(_feed[0]);
      replaceMustache(data, _feed[0]).then((template) => {
        setActiveTemplate(template);
        setImmediate(() => {
          trackEvent(`New ${feedTypeName} Selected`, `${feedTypeName}s`, {
            [feedTypeName.toLowerCase()]: template.name,
            [`${feedTypeName.toLowerCase()}Default`]: true,
          });
        });
      });
    });

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntegration]);

  const handleTemplateChange = (template: Feed) => {
    setRawActiveTemplate(template);
    trackEvent(`New ${feedTypeName} Selected`, `${feedTypeName}s`, {
      [feedTypeName.toLowerCase()]: template.name,
      [`${feedTypeName.toLowerCase()}Default`]: false,
    });
    replaceMustache(data, template).then((_template) => {
      setActiveTemplate(_template);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <SC.Card onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e)} open={open} ref={ref} tabIndex={-1}>
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
        <SC.Column border>
          <SC.ColumnSearchWrapper>
            <TextField
              style={{ width: '100%' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => debouncedSetSearchFilter(e.target.value)}
              label="Search"
            />
            <SC.ColumnSearchIcon src={search} alt={`Search ${feedTypeName}`} height="24" width="24" />
          </SC.ColumnSearchWrapper>
          {loading ? (
            <Loader />
          ) : (
            feed.map((feedEntry: Feed) => {
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
              }
              return null;
            })
          )}
        </SC.Column>
        <SC.ColumnBr />
        <SC.ConnectorInfo>
          {loading ? (
            <Loader />
          ) : (
            <>
              <SC.ConnectorTitleWrapper>
                <SC.ConnectorImage src={activeTemplate?.smallIcon} alt="slack" height="28" width="28" />
                <SC.ConnectorTitle>{activeTemplate?.name}</SC.ConnectorTitle>
                <SC.ConnectorVersion>{activeTemplate?.version}</SC.ConnectorVersion>
              </SC.ConnectorTitleWrapper>
              <SC.GeneralInfoWrapper>
                <SC.ConnectorDescription>{activeTemplate?.description || ''}</SC.ConnectorDescription>
                <SC.FormWrapper>
                  <JsonForms
                    schema={activeTemplate?.configuration.schema}
                    uischema={activeTemplate?.configuration.uischema}
                    data={data}
                    renderers={materialRenderers}
                    cells={materialCells}
                    onChange={({ errors: _errors, data: _data }) => {
                      if (_data?.ui?.toggle && activeTemplate) {
                        trackEvent('New Integration Customize Clicked', 'Integrations', {
                          integration: activeTemplate.name,
                        });
                      }
                      if (_errors) setErrors(_errors);
                      setData(_data);
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
            </>
          )}
        </SC.ConnectorInfo>
      </SC.Flex>
    </SC.Card>
  );
});

export default FeedPicker;
