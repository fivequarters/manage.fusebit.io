import { Account } from './account';

export enum cells {
  NAME = 'Name',
  EMAIL = 'Email',
  USER_ID = 'User-ID',
}

export interface RowProps {
  row: Account;
  handleRowClick: Function;
  isSelected: Function;
  selectedCell: string;
  handleCheck: Function;
  mobile?: boolean;
}
