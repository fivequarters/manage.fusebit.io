export enum ConnectorCells {
  TYPE = 'Type',
  IDENTITIES = 'Identities',
  CREATED = 'Created',
}

export enum IntegrationCells {
  INSTALLS = 'Installs',
  CREATED = 'Created',
  DEPLOYED = 'Deployed',
}

export enum UserCells {
  NAME = 'Name',
  EMAIL = 'Email',
  USER_ID = 'User-ID',
}

export interface Row {
  id: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  primaryEmail?: string;
  tags?: {
    [key: string]: any;
  };
  dateAdded?: string;
  dateModified?: string;
  version?: string;
}

export interface Props {
  row: Row;
  handleRowClick: Function;
  handleCheck: Function;
  isSelected: Function;
  mobile?: boolean;
  selectedCell?: string;
  integrationsTable?: boolean;
  connectorsTable?: boolean;
  installs?: {
    data: {
      total: number;
    };
  };
}
