import { SetStateAction, useEffect, useState } from 'react';
import constate from 'constate';

const ORDER_DEFAULT = 'asc';
const ORDER_BY_DEFAULT = 'sortableCreatedAt';

export enum OrderType {
  ORDER = 'order',
  ORDER_BY = 'orderBy',
}

const _useSortingPreferences = () => {
  const [order, setOrder] = useState(ORDER_DEFAULT);
  const [orderBy, setOrderBy] = useState(ORDER_BY_DEFAULT);

  const handleSorting = (left: any, right: any) => {
    if (left < right) {
      return 1;
    }
    if (left > right) {
      return -1;
    }
    return 0;
  };

  const initSortingPreference = (
    type: OrderType.ORDER | OrderType.ORDER_BY,
    defaultPreference: string,
    orderSetter: (value: SetStateAction<string>) => void
  ) => {
    const orderPreference = localStorage.getItem(type) || defaultPreference;
    orderSetter(orderPreference);
  };

  useEffect(() => {
    initSortingPreference(OrderType.ORDER, ORDER_DEFAULT, setOrder);
    initSortingPreference(OrderType.ORDER_BY, ORDER_BY_DEFAULT, setOrderBy);
  }, []);

  const handleSortingPreferenceChange = (type: OrderType.ORDER | OrderType.ORDER_BY, newOrder: string) => {
    if (type === OrderType.ORDER) {
      setOrder(newOrder);
    } else {
      setOrderBy(newOrder);
    }

    localStorage.setItem(type, newOrder);
  };

  return {
    order,
    orderBy,
    handleSorting,
    handleSortingPreferenceChange,
  };
};

const [SortingProvider, useSortingPreferences] = constate(_useSortingPreferences);

export { SortingProvider, useSortingPreferences };
