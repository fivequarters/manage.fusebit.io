import { Account } from './account';
import { Connector } from './connector';
import { Integration } from './integration';

export interface Props {
  headless?: any;
  setHeadless?: Function;
  selectedCell: string;
  handlePreviousCellSelect: Function;
  handleNextCellSelect: Function;
  integrationTable?: boolean;
  connectorTable?: boolean;
  reloadIntegrations?: Function;
  reloadConnectors?: Function;
  reloadUsers?: Function;
  integrations?: {
    data: {
      items: Integration[];
    };
  };
  connectors?: {
    data: {
      items: Connector[];
    };
  };
  users?: {
    data: {
      items: Account[];
    };
  };
}
