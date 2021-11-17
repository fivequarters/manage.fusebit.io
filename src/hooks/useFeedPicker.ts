import React, { useEffect, useMemo } from 'react';
import { ValidationMode } from '@jsonforms/core';
import debounce from 'lodash.debounce';
import { useMediaQuery } from '@material-ui/core';
import { Feed, ParsedFeed } from '@interfaces/feed';
import { trackEvent } from '@utils/analytics';
import { Data } from '@interfaces/feedPicker';
import { useQueryClient } from 'react-query';
import useFilterFeed from './useFilterFeed';
import { useQuery } from './useQuery';
import { useReplaceMustache } from './useReplaceMustache';

interface Props {
  isIntegration?: boolean;
  onSubmit: (feed: Feed, data: Data) => void;
  onClose?: () => void;
  open: boolean;
}

const useFeedPicker = ({ isIntegration, onSubmit, onClose, open }: Props) => {
  const query = useQuery();
  const [rawActiveTemplate, setRawActiveTemplate] = React.useState<Feed>();
  const [errors, setErrors] = React.useState<object[]>([]);
  const [validationMode, setValidationMode] = React.useState<ValidationMode>('ValidateAndHide');
  const [data, setData] = React.useState<any>({});
  const { replaceMustache } = useReplaceMustache();
  const [activeTemplate, setActiveTemplate] = React.useState<ParsedFeed>();
  const isMobile = useMediaQuery('max-width: 1100px');

  const feedTypeName = isIntegration ? 'Integration' : 'Connector';

  const queryClient = useQueryClient();

  const feed = useMemo(
    () =>
      isIntegration
        ? queryClient.getQueryData<Feed[]>('getIntegrationsFeed') || []
        : queryClient.getQueryData<Feed[]>('getConnectorsFeed') || [],
    [isIntegration, queryClient]
  );

  useEffect(() => {
    if (feed.length > 0) {
      const key = query.get('key');

      for (let i = 0; i < (feed || []).length; i++) {
        if ((feed || [])[i].id === key) {
          setRawActiveTemplate(feed[i]);
          replaceMustache(data, feed[i]).then((template) => setActiveTemplate(template));
          return;
        }
      }

      setRawActiveTemplate(feed[0]);
      replaceMustache(data, feed[0]).then((template) => {
        setActiveTemplate(template);
        setImmediate(() => {
          trackEvent(`New ${feedTypeName} Selected`, `${feedTypeName}s`, {
            [feedTypeName.toLowerCase()]: template.id,
            [`${feedTypeName.toLowerCase()}Default`]: true,
          });
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntegration, open, feed]);

  const filteredFeed = useFilterFeed({ feed });

  const isLoading = isIntegration
    ? queryClient.getQueryState('getIntegrationsFeed')?.status === 'loading'
    : queryClient.getQueryState('getConnectorsFeed')?.status === 'loading';

  const debouncedSetSearchFilter = debounce((keyword: string) => {
    if (isIntegration) {
      trackEvent('New Integration Search Submitted', 'Integrations');
    } else {
      trackEvent('New Connector Search Submitted', 'Connectors');
    }
    filteredFeed.setSearchFilter(keyword.trim());
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
    filteredFeed.setActiveFilter(filter);
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
    loading: isLoading,
    handleSubmit,
    feedTypeName,
    ...filteredFeed,
    isMobile,
  };
};

export default useFeedPicker;
