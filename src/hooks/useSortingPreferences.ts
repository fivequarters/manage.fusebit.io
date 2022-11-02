import { useEffect, useState } from 'react';
import constate from 'constate';

const DEFAULT_PREFERENCES = {
  integrations: {
    table: {
      order: 'asc',
      orderBy: 'sortableCreatedAt',
    },
  },
  connectors: {
    table: {
      order: 'asc',
      orderBy: 'sortableCreatedAt',
    },
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
    const savedEntities = localStorage.getItem('entities');
    if (savedEntities) {
      const entities = JSON.parse(savedEntities);
      setPreferences(entities);
    }
  }, []);

  const handleSortingPreferenceChange = (key: string, value: { orderBy: string; order: string }) => {
    const entities = JSON.parse(localStorage.getItem('entities') || '{}');
    entities[key] = {
      table: value,
    };

    localStorage.setItem('entities', JSON.stringify(entities));
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
