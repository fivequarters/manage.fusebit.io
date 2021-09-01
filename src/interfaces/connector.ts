export interface Connector {
  id: string;
  data: {
    configuration: object;
    files: object;
    handler: string;
    id: string;
  };
  dateAdded: string;
  dateModified: string;
  tags: {
    [key: string]: any;
  };
  version: string;
}

interface Element {
  type: string;
  scope: string;
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
