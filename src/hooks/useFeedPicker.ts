import React, { useEffect, useMemo } from 'react';
import { ValidationMode } from '@jsonforms/core';
import debounce from 'lodash.debounce';
import { useMediaQuery } from '@material-ui/core';
import { Feed, Snippet, ParsedFeed } from '@interfaces/feed';
import { trackEvent } from '@utils/analytics';
import { Data } from '@interfaces/feedPicker';
import orderBy from 'lodash.orderby';
import { useQueryClient } from 'react-query';
import useFilterFeed from './useFilterFeed';
import { useQuery } from './useQuery';
import { useReplaceMustache } from './useReplaceMustache';

interface Props {
  isIntegration?: boolean;
  isSnippet?: boolean;
  onSubmit: (feed: Feed, data: Data, snippet?: Snippet) => void;
  onClose?: () => void;
  open: boolean;
}

const useFeedPicker = ({ isIntegration, onSubmit, onClose, open, isSnippet }: Props) => {
  const query = useQuery();
  const [rawActiveTemplate, setRawActiveTemplate] = React.useState<Feed>();
  const [rawActiveSnippet, setRawActiveSnippet] = React.useState<Snippet>();
  const [errors, setErrors] = React.useState<object[]>([]);
  const [validationMode, setValidationMode] = React.useState<ValidationMode>('ValidateAndHide');
  const [data, setData] = React.useState<any>({});
  const { replaceMustache } = useReplaceMustache();
  const [activeTemplate, setActiveTemplate] = React.useState<ParsedFeed>();
  const [activeSnippet, setActiveSnippet] = React.useState<Snippet>();
  const isMobile = useMediaQuery('max-width: 1100px');

  let feedTypeName = isIntegration ? 'Integration' : 'Connector';
  if (isSnippet) {
    feedTypeName = 'Snippet';
  }

  const queryClient = useQueryClient();

  const feed = useMemo(
    () =>
      isIntegration
        ? queryClient.getQueryData<Feed[]>('getIntegrationsFeed') || []
        : queryClient.getQueryData<Feed[]>('getConnectorsFeed') || [],
    [isIntegration, queryClient]
  );

  useEffect(() => {
    if (feed.length > 0 && open) {
      const key = query.get('key');

      let templateToActivate: Feed | undefined;
      if (isSnippet) {
        // find first connector with snippets
        const result = feed.find((f) => f.snippets && f.snippets.length > 0);
        if (result) {
          templateToActivate = result;
        }
      } else if (key) {
        [templateToActivate] = feed;
        for (let i = 0; i < feed.length; i++) {
          if (feed[i].id === key) {
            templateToActivate = feed[i];
            // When explicitly loading an entry, remove the private designation so that it shows up in the
            // middle list.
            delete templateToActivate.private;
            break;
          }
        }
      } else {
        [templateToActivate] = feed;
      }
      if (templateToActivate) {
        setRawActiveTemplate(templateToActivate);
        replaceMustache(data, templateToActivate).then((template) => {
          setActiveTemplate(template);
          if (!key && !isSnippet) {
            setImmediate(() => {
              trackEvent(`New ${feedTypeName} Selected`, `${feedTypeName}s`, {
                [feedTypeName.toLowerCase()]: template.id,
                [`${feedTypeName.toLowerCase()}Default`]: true,
              });
            });
          }
        });
        if (isSnippet && templateToActivate.snippets && templateToActivate.snippets.length > 0) {
          setRawActiveSnippet(templateToActivate.snippets[0]);
          // TODO replace snippet mustache
          setActiveSnippet(templateToActivate.snippets[0]);
          trackEvent(`New Snippet Selected`, `Add Snippet`, {
            snippet: `${templateToActivate.id}-${templateToActivate.snippets[0].id}`,
            snippetDefault: true,
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntegration, isSnippet, open, feed]);

  const filteredFeed = useFilterFeed({ feed, filterSnippets: isSnippet });

  const isLoading = isIntegration
    ? queryClient.getQueryState('getIntegrationsFeed')?.status === 'loading'
    : queryClient.getQueryState('getConnectorsFeed')?.status === 'loading';

  const debouncedSetSearchFilter = debounce((keyword: string) => {
    if (isIntegration) {
      trackEvent('New Integration Search Submitted', 'Integrations');
    } else if (isSnippet) {
      trackEvent('Add Snippet Search Submitted', 'Add Snippet');
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
      onSubmit(rawActiveTemplate as Feed, { ...data }, isSnippet ? rawActiveSnippet : undefined);
    }
  };

  const handleTemplateChange = (template: Feed, snippet?: Snippet) => {
    setRawActiveTemplate(template);
    if (snippet) {
      setRawActiveSnippet(snippet);
      trackEvent(`New Snippet Selected`, `Add Snippet`, {
        snippet: `${template.id}-${snippet.id}`,
        snippetDefault: false,
      });
    } else {
      trackEvent(`New ${feedTypeName} Selected`, `${feedTypeName}s`, {
        [feedTypeName.toLowerCase()]: template.id,
        [`${feedTypeName.toLowerCase()}Default`]: false,
      });
    }
    replaceMustache(data, template).then((_template) => {
      setActiveTemplate(_template);
    });
    if (snippet) {
      // TODO replace snippet mustache
      setActiveSnippet(snippet);
    }
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

  const orderAlpha = (unsortedFeed: Feed[]) => {
    const list: Feed[] = orderBy(unsortedFeed, [(feedEntry: Feed) => feedEntry.name.toLowerCase()], ['asc']);

    const index = list.findIndex((a: Feed) => a.id === 'custom-planned');

    if (index > -1) {
      const removedItem: Feed = list.splice(index, 1)[0];
      list.push(removedItem);
    }

    return list;
  };

  const getFullTemplateId = (template: Feed, snippet?: Snippet) => {
    return snippet ? `${template.id}-${snippet.id}` : template.id;
  };

  const getFullTemplateName = (template: Feed, snippet?: Snippet) => {
    return snippet ? `${template.name} - ${snippet.name}` : template.name;
  };

  return {
    getFullTemplateId,
    getFullTemplateName,
    rawActiveTemplate,
    setRawActiveTemplate,
    rawActiveSnippet,
    setRawActiveSnippet,
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
    activeSnippet,
    setActiveSnippet,
    handleTemplateChange,
    loading: isLoading,
    handleSubmit,
    feedTypeName,
    ...filteredFeed,
    isMobile,
    orderAlpha,
  };
};

export default useFeedPicker;
