import { Connector } from './connector';

export interface OverviewProps {
  headless: any;
  setHeadless: Function;
}

export enum cells {
  TYPE = 'Type',
  IDENTITIES = 'Identities',
  CREATED = 'Created',
}

export interface RowProps {
  row: Connector;
  handleRowClick: Function;
  handleCheck: Function;
  isSelected: Function;
  mobile?: boolean;
  selectedCell?: string;
}
