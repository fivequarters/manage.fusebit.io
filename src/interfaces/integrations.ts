import { Integration } from './integration';

export interface OverviewProps {
  headless: any;
  setHeadless: Function;
}
export enum cells {
  INSTANCES = 'Instances',
  CREATED = 'Created',
  DEPLOYED = 'Deployed',
}

export interface RowProps {
  row: Integration;
  handleRowClick: Function;
  handleCheck: Function;
  isSelected: Function;
  mobile?: boolean;
  selectedCell?: string;
}
