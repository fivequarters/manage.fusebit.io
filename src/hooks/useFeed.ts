import React, { useEffect, useState } from 'react';
import { ValidationMode } from '@jsonforms/core';
import debounce from 'lodash.debounce';
import { useMediaQuery } from '@material-ui/core';
import { Feed, ParsedFeed } from '@interfaces/feed';
import { trackEvent } from '@utils/analytics';
import { Data } from '@interfaces/feedPicker';
import orderBy from 'lodash.orderby';
import { integrationsFeed, connectorsFeed } from '../static/feed';
import useFilterFeed from './useFilterFeed';
import { useQuery } from './useQuery';
import { useReplaceMustache } from './useReplaceMustache';

interface Props {
  isIntegration?: boolean;
  onSubmit: (feed: Feed, data: Data) => void;
  onClose?: () => void;
  open: boolean;
}

const useFeed = ({ isIntegration, onSubmit, onClose, open }: Props) => {
  const [feed, setFeed] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(false);
  const query = useQuery();
  const [rawActiveTemplate, setRawActiveTemplate] = React.useState<Feed>();
  const [errors, setErrors] = React.useState<object[]>([]);
  const [validationMode, setValidationMode] = React.useState<ValidationMode>('ValidateAndHide');
  const [data, setData] = React.useState<any>({});
  const { replaceMustache } = useReplaceMustache();
  const [activeTemplate, setActiveTemplate] = React.useState<ParsedFeed>();
  const filtedFeed = useFilterFeed({ feed });
  const isMobile = useMediaQuery('max-width: 1100px');

  const feedTypeName = isIntegration ? 'Integration' : 'Connector';

  useEffect(() => {
    const key = query.get('key');

    setLoading(true);

    (isIntegration ? integrationsFeed() : connectorsFeed())
      .then((_feed) => {
        setFeed(_feed);
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
              [feedTypeName.toLowerCase()]: template.id,
              [`${feedTypeName.toLowerCase()}Default`]: true,
            });
          });
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntegration, open]);

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
      [feedTypeName.toLowerCase()]: template.id,
      [`${feedTypeName.toLowerCase()}Default`]: false,
    });
    replaceMustache(data, template).then((_template) => {
      setActiveTemplate(_template);
    });
  };

  const handlePlanUpsell = () => {
    if (rawActiveTemplate) {
      if (isIntegration) {
        trackEvent('New Integration Enable Button Clicked', 'Integrations', { integration: rawActiveTemplate.id });
      } else {
        trackEvent('New Connector Enable Button Clicked', 'Connectors', { connector: rawActiveTemplate.id });
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
    if (_data?.ui?.toggle && activeTemplate) {
      trackEvent('New Integration Customize Clicked', 'Integrations', {
        integration: activeTemplate.id,
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
  const orderAlpha = (unsortedFeed: Feed[]) => {
    const list: Feed[] = orderBy(unsortedFeed, [(feedEntry: Feed) => feedEntry.name.toLowerCase()], ['asc']);

    const index = list.findIndex((a: Feed) => a.id === 'custom-planned');

    if (index > -1) {
      const removedItem: Feed = list.splice(index, 1)[0];
      list.push(removedItem);
    }

    return list;
  };

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
    feedTypeName,
    ...filtedFeed,
    isMobile,
    orderAlpha,
  };
};

export default useFeed;
