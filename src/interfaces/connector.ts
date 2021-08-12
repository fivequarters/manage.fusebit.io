export interface Connector {
  id: string;
  data: object;
  tags: {
    [key: string]: any;
  };
  version: string;
  expires: string;
}

interface Element {
  type: string;
  scope: string;
}

export interface ConnectorConfig {
  data: {
    accessTokenExpirationBuffer: number;
    authorizationUrl: string;
    clientId: string;
    clientSecret: string;
    mountUrl: string;
    refreshBackoffIncrement: number;
    refreshErrorLimit: number;
    refreshInitialBackoff: number;
    refreshWaitCountLimit: number;
    scope: string;
    tokenUrl: string;
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
