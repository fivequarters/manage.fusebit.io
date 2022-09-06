export interface Connector {
  id: string;
  entityId: string;
  data: {
    configuration: object;
    files: {
      'package.json': string;
      [x: string]: string;
    };
    handler: string;
    id: string;
  };
  dateAdded: string;
  dateModified: string;
  tags: {
    [key: string]: any;
  };
  version: string;
  missing?: boolean;
}

export interface Element {
  type: string;
  scope: string;
  label?: string;
}

export interface ConnectorConfig {
  data: {
    [key: string]: any;
  };
  schema: {
    properties: {
      [key: string]: object;
    };
    required: string[];
    type: string;
  };
  uischema: {
    elements: Element[];
    type: string;
  };
  success: boolean;
}

export interface Props {
  id: string;
}
