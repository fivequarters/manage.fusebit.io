import React, { useEffect, useState } from 'react';
import { ValidationMode } from '@jsonforms/core';
import debounce from 'lodash.debounce';
import { Feed, ParsedFeed } from '../interfaces/feed';
import { trackEvent } from '../utils/analytics';
import useFilterFeed from './useFilterFeed';
import { useQuery } from './useQuery';
import { useReplaceMustache } from './useReplaceMustache';
import { integrationsFeed, connectorsFeed } from '../static/feed';

interface Props {
  isIntegration?: boolean;
  feedTypeName: string;
  onSubmit: (a: any, b: any) => void;
  onClose?: () => void;
}

const useFeed = ({ isIntegration, feedTypeName, onSubmit, onClose }: Props) => {
  const [feed, setFeed] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const query = useQuery();
  const [rawActiveTemplate, setRawActiveTemplate] = React.useState<Feed>();
  const [errors, setErrors] = React.useState<object[]>([]);
  const [validationMode, setValidationMode] = React.useState<ValidationMode>('ValidateAndHide');
  const [data, setData] = React.useState<any>({});
  const { replaceMustache } = useReplaceMustache();
  const [activeTemplate, setActiveTemplate] = React.useState<ParsedFeed>();
  const filtedFeed = useFilterFeed({ feed });

  const debouncedSetSearchFilter = debounce((keyword: string) => {
    if (isIntegration) {
      trackEvent('New Integration Search Submitted', 'Integrations');
    } else {
      trackEvent('New Connector Search Submitted', 'Connectors');
    }
    filtedFeed.setSearchFilter(keyword.trim());
  }, 500);

  const handleAdd = () => {
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

  const handlePlanUpsell = () => {
    if (rawActiveTemplate) {
      if (isIntegration) {
        trackEvent('Interest in Integration', 'Integrations', { tag: rawActiveTemplate.id });
      } else {
        trackEvent('Interest in Connector', 'Connectors', { tag: rawActiveTemplate.id });
      }
      window.Intercom('showNewMessage', `I'm interested in enabling ${rawActiveTemplate.name}`);
    }
    onClose?.();
  };

  const handleFilterChange = (filter: string) => {
    if (isIntegration) {
      trackEvent('New Integration Catalog Clicked', 'Integrations', { tag: filter });
    } else {
      trackEvent('New Connector Catalog Clicked', 'Connectors', { tag: filter });
    }
    filtedFeed.setActiveFilter(filter);
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

  const handleSubmit = () => {
    return activeTemplate?.outOfPlan ? handlePlanUpsell() : handleAdd();
  };

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

  return {
    rawActiveTemplate,
    setRawActiveTemplate,
    errors,
    setErrors,
    validationMode,
    setValidationMode,
    data,
    setData,
    handleJsonFormsChange,
    handleFilterChange,
    handlePlanUpsell,
    handleAdd,
    debouncedSetSearchFilter,
    activeTemplate,
    setActiveTemplate,
    handleTemplateChange,
    feed,
    setFeed,
    loading,
    handleSubmit,
    ...filtedFeed,
  };
};

export default useFeed;
