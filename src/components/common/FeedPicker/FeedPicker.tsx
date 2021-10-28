import React, { useState, useEffect } from 'react';

import { ValidationMode } from '@jsonforms/core';
import { Box, Button, TextField } from '@material-ui/core';
import debounce from 'lodash.debounce';
import { Props } from '@interfaces/feedPicker';
import { integrationsFeed, connectorsFeed } from '@static/feed';
import search from '@assets/search.svg';
import cross from '@assets/cross.svg';
import { Feed, ParsedFeed } from '@interfaces/feed';
import { useQuery } from '@hooks/useQuery';
import { useReplaceMustache } from '@hooks/useReplaceMustache';
import { trackEvent } from '@utils/analytics';
import Loader from '@components/common/Loader';
import { useTrackPage } from '@hooks/useTrackPage';
import { urlOrSvgToImage } from '@utils/utils';
import BaseJsonForm from '@components/common/BaseJsonForm';
import useFilterFeed, { DefaultFilters } from '@hooks/useFilterFeed';
import * as SC from './styles';

const FeedPicker = React.forwardRef<HTMLDivElement, Props>(({ open, onClose, onSubmit, isIntegration }, ref) => {
  const [data, setData] = React.useState<any>({});
  const [errors, setErrors] = React.useState<object[]>([]);
  const [validationMode, setValidationMode] = React.useState<ValidationMode>('ValidateAndHide');
  const [feed, setFeed] = useState<Feed[]>([]);
  const [activeTemplate, setActiveTemplate] = React.useState<ParsedFeed>();
  const [rawActiveTemplate, setRawActiveTemplate] = React.useState<Feed>();
  const [loading, setLoading] = React.useState(true);
  const query = useQuery();
  const { replaceMustache } = useReplaceMustache();
  const { activeFilter, allTags, filteredFeed, setActiveFilter, setSearchFilter } = useFilterFeed({
    feed,
  });

  const debouncedSetSearchFilter = debounce((keyword: string) => {
    if (isIntegration) {
      trackEvent('New Integration Search Submitted', 'Integrations');
    } else {
      trackEvent('New Connector Search Submitted', 'Connectors');
    }
    setSearchFilter(keyword.trim());
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
      onSubmit(rawActiveTemplate as Feed, { ...data });
    }
  };

  const handlePlanUpsell = () => {
    if (rawActiveTemplate) {
      if (isIntegration) {
        trackEvent('Interest in Integration', 'Integrations', { tag: rawActiveTemplate.id });
      } else {
        trackEvent('Interest in Connector', 'Connectors', { tag: rawActiveTemplate.id });
      }
      window.Intercom('showNewMessage', `I'm interested in enabling ${rawActiveTemplate.name}`);
    }
    onClose();
  };

  const handleFilterChange = (filter: string) => {
    if (isIntegration) {
      trackEvent('New Integration Catalog Clicked', 'Integrations', { tag: filter });
    } else {
      trackEvent('New Connector Catalog Clicked', 'Connectors', { tag: filter });
    }
    setActiveFilter(filter);
  };

  const handleJsonFormsChange = ({ errors: _errors, data: _data }: { errors: any; data: any }) => {
    if (data?.ui?.toggle && activeTemplate) {
      trackEvent('New Integration Customize Clicked', 'Integrations', {
        integration: activeTemplate.name,
      });
    }
    if (_errors) {
      setErrors(_errors);
    }
    setData(_data);
  };

  const feedTypeName = isIntegration ? 'Integration' : 'Connector';

  useTrackPage(`${feedTypeName} New Modal`, `${feedTypeName}s`);

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
          {loading ? (
            <Box minWidth="254px">
              <Loader />
            </Box>
          ) : (
            <>
              <SC.ColumnItem
                onClick={() => handleFilterChange(DefaultFilters.ALL)}
                active={activeFilter === DefaultFilters.ALL}
                capitalize
              >
                {DefaultFilters.ALL}
              </SC.ColumnItem>
              {allTags.map((tag) => (
                <SC.ColumnItem
                  active={tag === activeFilter}
                  key={tag}
                  onClick={() => handleFilterChange(tag)}
                  capitalize
                >
                  {tag}
                </SC.ColumnItem>
              ))}
            </>
          )}
        </SC.Column>
        <SC.ColumnBr />
        <SC.Column border>
          <SC.ColumnSearchWrapper>
            <TextField fullWidth onChange={(e) => debouncedSetSearchFilter(e.target.value)} label="Search" />
            <SC.ColumnSearchIcon src={search} alt={`Search ${feedTypeName}`} height="24" width="24" />
          </SC.ColumnSearchWrapper>
          {loading || !activeTemplate ? (
            <Loader />
          ) : (
            <Box overflow="auto">
              {filteredFeed.map((feedEntry) => {
                return (
                  <SC.ColumnItem
                    key={feedEntry.id}
                    onClick={() => handleTemplateChange(feedEntry)}
                    active={feedEntry.id === activeTemplate.id}
                  >
                    <SC.ColumnItemImage
                      src={urlOrSvgToImage(feedEntry.smallIcon)}
                      alt={feedEntry.name}
                      height="18"
                      width="18"
                    />
                    {feedEntry.name}
                  </SC.ColumnItem>
                );
              })}
            </Box>
          )}
        </SC.Column>
        <SC.ColumnBr />
        <SC.ConnectorInfo>
          {loading || !activeTemplate ? (
            <Loader />
          ) : (
            <>
              <SC.ConnectorTitleWrapper>
                <SC.ConnectorImage
                  src={urlOrSvgToImage(activeTemplate.smallIcon)}
                  alt={activeTemplate.name || 'slack'}
                  height="28"
                  width="28"
                />
                <SC.ConnectorTitle>{activeTemplate.name}</SC.ConnectorTitle>
                <SC.ConnectorVersion>{activeTemplate.version}</SC.ConnectorVersion>
              </SC.ConnectorTitleWrapper>
              <SC.GeneralInfoWrapper>
                <SC.ConnectorDescription>{activeTemplate.description || ''}</SC.ConnectorDescription>
                {activeTemplate.outOfPlan || (
                  <SC.FormWrapper>
                    <BaseJsonForm
                      schema={activeTemplate.configuration.schema}
                      uischema={activeTemplate.configuration.uischema}
                      data={data}
                      onChange={handleJsonFormsChange}
                      validationMode={validationMode}
                    />
                  </SC.FormWrapper>
                )}
              </SC.GeneralInfoWrapper>
              <SC.MobileHidden>
                <Button
                  onClick={activeTemplate.outOfPlan ? handlePlanUpsell : handleSubmit}
                  style={{ width: '200px', marginTop: 'auto', marginLeft: 'auto' }}
                  fullWidth={false}
                  size="large"
                  color="primary"
                  variant="contained"
                >
                  {activeTemplate.outOfPlan ? 'Enable' : 'Create'}
                </Button>
              </SC.MobileHidden>
              <SC.MobileVisible>
                <Button
                  onClick={activeTemplate.outOfPlan ? handlePlanUpsell : handleSubmit}
                  style={{ width: '200px', margin: 'auto' }}
                  fullWidth={false}
                  size="large"
                  color="primary"
                  variant="contained"
                >
                  {activeTemplate.outOfPlan ? 'Enable' : 'Create'}
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
