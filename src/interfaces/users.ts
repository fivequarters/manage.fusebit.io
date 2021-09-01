import { Row } from './tableRow';

export interface RowProps {
  row: Row;
  handleRowClick: Function;
  isSelected: Function;
  selectedCell: string;
  handleCheck: Function;
  mobile?: boolean;
}
