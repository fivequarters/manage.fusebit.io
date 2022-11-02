import { useEffect, useState } from 'react';
import constate from 'constate';

const SORTING_PREFERENCES_KEY = 'entities';

const DEFAULT_TABLE = {
  order: 'asc',
  orderBy: 'sortableCreatedAt',
};

const DEFAULT_PREFERENCES = {
  integrations: {
    table: DEFAULT_TABLE,
  },
  connectors: {
    table: DEFAULT_TABLE,
  },
  installs: {
    table: DEFAULT_TABLE,
  },
  identities: {
    table: DEFAULT_TABLE,
  },
};

const _useSortingPreferences = () => {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  const handleSorting = (left: any, right: any) => {
    if (left < right) {
      return 1;
    }
    if (left > right) {
      return -1;
    }
    return 0;
  };

  useEffect(() => {
    const savedEntities = localStorage.getItem(SORTING_PREFERENCES_KEY);
    if (savedEntities) {
      const entities = JSON.parse(savedEntities);
      setPreferences(entities);
    }
  }, []);

  const handleSortingPreferenceChange = (key: string, value: { orderBy: string; order: string }) => {
    const entities = JSON.parse(localStorage.getItem(SORTING_PREFERENCES_KEY) || '{}');
    entities[key] = {
      table: value,
    };

    localStorage.setItem(SORTING_PREFERENCES_KEY, JSON.stringify(entities));
    setPreferences({ ...DEFAULT_PREFERENCES, ...entities });
  };

  return {
    preferences,
    handleSorting,
    handleSortingPreferenceChange,
  };
};

const [SortingProvider, useSortingPreferences] = constate(_useSortingPreferences);

export { SortingProvider, useSortingPreferences };
