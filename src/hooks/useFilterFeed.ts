import { useMemo, useState } from 'react';
import { Feed } from '@interfaces/feed';

export enum DefaultFilters {
  ALL = 'all',
}

interface Props {
  feed?: Feed[];
  filterSnippets?: boolean;
}

const useFilterFeed = ({ feed = [], filterSnippets }: Props) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>(DefaultFilters.ALL);

  const allTags = useMemo(() => [...new Set(feed?.map((feedEntry) => feedEntry.tags.catalog?.split(',')).flat())], [
    feed,
  ]);

  const searchTerms = searchFilter
    .split(/\s+/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0);

  // An entry matches is it contains ALL of the search terms
  const isMatch = (fullText: string) =>
    searchTerms.length === 0 || searchTerms.find((t) => fullText.indexOf(t) < 0) === undefined;

  const filteredFeed: Feed[] = [];
  feed.forEach((feedEntry) => {
    if (activeFilter !== DefaultFilters.ALL && !feedEntry.tags.catalog.includes(activeFilter)) {
      return;
    }
    if (filterSnippets) {
      let entryToPush: Feed | undefined;
      feedEntry.snippets?.forEach((snippet) => {
        if (isMatch(`${feedEntry.name.toLowerCase()} ${snippet.name.toLowerCase()}`)) {
          if (!entryToPush) {
            entryToPush = {
              ...feedEntry,
              snippets: [],
            };
          }
          entryToPush.snippets?.push(snippet);
        }
      });
      if (entryToPush) {
        filteredFeed.push(entryToPush);
      }
    } else if (isMatch(feedEntry.name.toLowerCase())) {
      filteredFeed.push(feedEntry);
    }
  });

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
