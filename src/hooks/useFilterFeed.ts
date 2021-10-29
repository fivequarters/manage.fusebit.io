import { useMemo, useState } from 'react';
import { Feed } from '@interfaces/feed';

export enum DefaultFilters {
  ALL = 'all',
}

interface Props {
  feed?: Feed[];
}

const useFilterFeed = ({ feed = [] }: Props) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>(DefaultFilters.ALL);

  const allTags = useMemo(() => [...new Set(feed.map((feedEntry) => feedEntry.tags.catalog.split(',')).flat())], [
    feed,
  ]);

  const applySearchFilter = (feedEntry: Feed) => feedEntry.name.toLowerCase().includes(searchFilter.toLowerCase());

  const filteredFeed =
    activeFilter === DefaultFilters.ALL
      ? feed.filter(applySearchFilter)
      : feed.filter((feedEntry) => feedEntry.tags.catalog.includes(activeFilter) && applySearchFilter(feedEntry));

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
