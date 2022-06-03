import { BoxProps, ButtonProps } from '@material-ui/core';

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
  }[];
  newButtonText?: string;
  entityName?: string;
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
}
