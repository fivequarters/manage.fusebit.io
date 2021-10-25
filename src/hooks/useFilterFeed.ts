import React, { useMemo } from 'react';
import { Feed } from '../interfaces/feed';

interface Props {
  feed: Feed[];
}

export enum DefaultFilters {
  ALL = 'all',
}

const useFilterFeed = ({ feed }: Props) => {
  const [searchFilter, setSearchFilter] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<string>(DefaultFilters.ALL);

  const allTags = useMemo(
    () => [...new Set(feed.map((feedEntry) => feedEntry.tags.catalog.split(',').slice(1)).flat())],
    [feed]
  );

  const filteredFeed = useMemo(() => {
    const applySearchFilter = (feedEntry: Feed) => feedEntry.name.toLowerCase().includes(searchFilter.toLowerCase());

    return activeFilter === DefaultFilters.ALL
      ? feed.filter(applySearchFilter)
      : feed.filter((feedEntry) => feedEntry.tags.catalog.includes(activeFilter) && applySearchFilter(feedEntry));
  }, [activeFilter, feed, searchFilter]);

  return {
    filteredFeed,
    allTags,
    searchFilter,
    setSearchFilter,
    activeFilter,
    setActiveFilter,
  };
};

export default useFilterFeed;
