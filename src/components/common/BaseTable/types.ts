import React from 'react';
import { BoxProps, ButtonProps } from '@material-ui/core';
import { OrderType } from '@hooks/useSortingPreferences';

export interface BaseTableRow {
  id: string;
  collapsableContent?: React.ReactNode | React.ReactText;
  collapsableContentOpened?: () => void;
  hideCheckbox?: boolean;
  [x: string]: React.ReactNode | React.ReactText;
}

export interface BaseTableProps {
  selected: string[];
  loading: boolean;
  rows: BaseTableRow[];
  onSelectAll: (e?: React.ChangeEvent<HTMLInputElement>, alwaysSelectAll?: boolean) => void;
  onDeleteAll: () => void;
  onClickNew?: () => void;
  headers: {
    id: string;
    value: string;
    sort?: {
      sortVal: string;
    };
  }[];
  newButtonText?: string;
  entityName: string;
  entityNamePlural: string;
  onSelectRow: (e: any, id: string) => void;
  isSelected: (id: string) => boolean;
  rowsPerPage: any;
  page: any;
  emptyTableText: string;
  onChangePage?: (e: any, newPage: number) => void;
  onChangeRowsPerPage?: (e: any) => void;
  collapseTrigger?: string;
  isCollapsible?: boolean;
  onClickRow?: (row: BaseTableRow, columnId: string) => void;
  noMainColumn?: boolean;
  isAllChecked?: boolean;
  headerButtons?: {
    text: string;
    onClick: () => void;
    props?: ButtonProps;
  }[];
  hideCheckAll?: boolean;
  actionsContainerProps?: BoxProps;
  order?: string;
  orderBy?: string;
  onSortingPreferenceChange?: (type: OrderType.ORDER | OrderType.ORDER_BY, newOrder: string) => void;
  searchBarLabel?: string;
  searchInputHandler?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  textVal?: string;
}
