import { Connector } from './connector';
import { Integration } from './integration';

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
  row: Integration | Connector;
  handleRowClick: Function;
  handleCheck: Function;
  isSelected: Function;
  mobile?: boolean;
  selectedCell?: string;
}
