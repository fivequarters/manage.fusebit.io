import React, { useCallback, useEffect, useMemo } from 'react';
import { ValidationMode } from '@jsonforms/core';
import debounce from 'lodash.debounce';
import { useMediaQuery } from '@material-ui/core';
import { Feed, Snippet, ParsedFeed, ParsedSnippet } from '@interfaces/feed';
import { trackEventMemoized, trackEventUnmemoized } from '@utils/analytics';
import { sendIntercomMessage } from '@utils/intercom';
import { Data } from '@interfaces/feedPicker';
import orderBy from 'lodash.orderby';
import { useQueryClient } from 'react-query';
import useFilterFeed from './useFilterFeed';
import { useQuery } from './useQuery';
import { useReplaceMustache } from './useReplaceMustache';
import { useFeedQuery } from './useFeedQuery';

interface Props {
  isIntegration?: boolean;
  isSnippet?: boolean;
  isFork?: boolean;
  onSubmit: (feed: Feed, data: Data, snippet?: Snippet) => void;
  onClose?: () => void;
  open: boolean;
  defaultSnippet?: ParsedSnippet;
}

const useFeedPicker = ({ isIntegration, onSubmit, onClose, open, isSnippet, isFork, defaultSnippet }: Props) => {
  const query = useQuery();
  const { integrationsFeedQueryKey } = useFeedQuery();
  const [rawActiveTemplate, setRawActiveTemplate] = React.useState<Feed>();
  const [rawActiveSnippet, setRawActiveSnippet] = React.useState<Snippet>();
  const [errors, setErrors] = React.useState<object[]>([]);
  const [validationMode, setValidationMode] = React.useState<ValidationMode>('ValidateAndHide');
  const [data, setData] = React.useState<any>({});
  const { replaceMustache } = useReplaceMustache();
  const [activeTemplate, setActiveTemplate] = React.useState<ParsedFeed>();
  const [activeSnippet, setActiveSnippet] = React.useState<Snippet>();
  const [campaingIntegrationRef, setCampaingIntegrationRef] = React.useState<HTMLDivElement | null>(null);
  const [searchFocused, setSearchFocused] = React.useState<boolean>(false);
  const isMobile = useMediaQuery('max-width: 1100px');

  let feedTypeName = isIntegration ? 'Integration' : 'Connector';
  if (isFork) {
    feedTypeName = 'Fork';
  }
  if (isSnippet) {
    feedTypeName = 'Snippet';
  }

  const queryClient = useQueryClient();

  const feed = useMemo(() => {
    if (isFork) {
      return queryClient.getQueryData<Feed[]>(integrationsFeedQueryKey) || [];
    }
    return isIntegration
      ? queryClient.getQueryData<Feed[]>('getIntegrationsFeed') || []
      : queryClient.getQueryData<Feed[]>('getConnectorsFeed') || [];
  }, [isIntegration, queryClient, isFork, integrationsFeedQueryKey]);

  const key = query.get('key');
  const filteredFeed = useFilterFeed({ feed, filterSnippets: isSnippet });

  useEffect(() => {
    if (feed.length > 0 && open) {
      let templateToActivate: Feed | undefined;
      if (isSnippet) {
        const result = feed.find((f) => f.id === defaultSnippet?.feedId);

        if (defaultSnippet) {
          filteredFeed.setSearchFilter(defaultSnippet.name);
        }

        // find first connector with snippets
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
        replaceMustache(data, templateToActivate).then(({ feed: template, data: _data }) => {
          setActiveTemplate(template);
          setData(_data);
          if (!key && !isSnippet) {
            setImmediate(() => {
              trackEventMemoized(`New ${feedTypeName} Selected`, `${feedTypeName}s`, {
                [feedTypeName.toLowerCase()]: template.id,
                [`${feedTypeName.toLowerCase()}Default`]: true,
              });
            });
          }
        });
        if (isSnippet && templateToActivate.snippets && templateToActivate.snippets.length > 0) {
          const defaultRawSnippet = templateToActivate.snippets[0];
          const newRawSnippet = defaultSnippet?.name
            ? templateToActivate.snippets.find((s) => s.name === defaultSnippet?.name)
            : defaultRawSnippet;

          const newSnippet = newRawSnippet || defaultRawSnippet;
          setRawActiveSnippet(newSnippet);
          // TODO replace snippet mustache
          setActiveSnippet(newSnippet);
          trackEventMemoized(`New Snippet Selected`, `Add Snippet`, {
            snippet: `${templateToActivate.id}-${newSnippet.id}`,
            snippetDefault: true,
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntegration, isSnippet, open, feed, defaultSnippet]);

  useEffect(() => {
    if (campaingIntegrationRef) {
      campaingIntegrationRef.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [campaingIntegrationRef]);

  const isLoading = isIntegration
    ? queryClient.getQueryState('getIntegrationsFeed')?.status === 'loading'
    : queryClient.getQueryState('getConnectorsFeed')?.status === 'loading';

  const trackSearchInput = useCallback(
    (searchQuery: string) => {
      if (isIntegration) {
        trackEventUnmemoized('New Integration Search Execution', 'Integrations', {
          searchQuery,
        });
      } else if (isSnippet) {
        trackEventUnmemoized('Add Snippet Search Execution', 'Add Snippet', {
          searchQuery,
        });
      } else {
        trackEventUnmemoized('New Connector Search Execution', 'Connectors', {
          searchQuery,
        });
      }
    },
    [isIntegration, isSnippet]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearchFilter = useCallback(debounce(trackSearchInput, 500), [trackSearchInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;
    filteredFeed.setSearchFilter(value);
    debouncedSetSearchFilter(value.trim());
  };

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
      trackEventMemoized(`New Snippet Selected`, `Add Snippet`, {
        snippet: `${template.id}-${snippet.id}`,
        snippetDefault: false,
      });
    } else {
      trackEventMemoized(`New ${feedTypeName} Selected`, `${feedTypeName}s`, {
        [feedTypeName.toLowerCase()]: template.id,
        [`${feedTypeName.toLowerCase()}Default`]: false,
      });
    }
    replaceMustache(data, template).then(({ feed: _template, data: _data }) => {
      setActiveTemplate(_template);
      setData(_data);
    });
    if (snippet) {
      // TODO replace snippet mustache
      setActiveSnippet(snippet);
    }
  };

  const handlePlanUpsell = () => {
    if (rawActiveTemplate) {
      if (isIntegration) {
        trackEventMemoized('New Integration Enable Button Clicked', 'Integrations', {
          integration: rawActiveTemplate.id,
        });
      } else {
        trackEventMemoized('New Connector Enable Button Clicked', 'Connectors', { connector: rawActiveTemplate.id });
      }
      window.Intercom('showNewMessage', `I'm interested in enabling ${rawActiveTemplate.name}`);
      sendIntercomMessage();
    }
    onClose?.();
  };

  const handleFilterChange = (filter: string) => {
    if (isIntegration) {
      trackEventMemoized('New Integration Catalog Clicked', 'Integrations', { tag: filter });
    } else {
      trackEventMemoized('New Connector Catalog Clicked', 'Connectors', { tag: filter });
    }
    filteredFeed.setActiveFilter(filter);
  };

  const handleJsonFormsChange = ({ errors: _errors, data: _data }: { errors: any; data: any }) => {
    if (_data?.ui?.toggle && activeTemplate) {
      trackEventMemoized('New Integration Customize Clicked', 'Integrations', {
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
    key,
    campaingIntegrationRef,
    setCampaingIntegrationRef,
    searchFocused,
    setSearchFocused,
    trackSearchInput,
    handleInputChange,
  };
};

export default useFeedPicker;
