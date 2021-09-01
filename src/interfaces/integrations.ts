import { Row } from './tableRow';

export interface OverviewProps {
  headless: any;
  setHeadless: Function;
}
export enum cells {
  INSTALLS = 'Installs',
  CREATED = 'Created',
  DEPLOYED = 'Deployed',
}

export interface RowProps {
  row: Row;
  handleRowClick: Function;
  handleCheck: Function;
  isSelected: Function;
  mobile?: boolean;
  selectedCell?: string;
}
