import { Row } from './tableRow';

export interface OverviewProps {
  headless: any;
  setHeadless: (value: boolean) => void;
}

export interface RowProps {
  row: Row;
  handleRowClick: Function;
  handleCheck: Function;
  isSelected: Function;
  mobile?: boolean;
  selectedCell?: string;
}
