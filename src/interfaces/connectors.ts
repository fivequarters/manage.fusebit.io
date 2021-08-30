import { Connector } from './connector';
import { Integration } from './integration';

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
  row: Connector | Integration;
  handleRowClick: Function;
  handleCheck: Function;
  isSelected: Function;
  mobile?: boolean;
  selectedCell?: string;
}
