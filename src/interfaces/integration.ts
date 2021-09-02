export interface IntegrationData {
  components: InnerConnector[];
  componentTags: {
    [key: string]: any;
  };
  files: object;
}

export interface InnerConnector {
  name: string;
  entityType: string;
  entityId: string;
  dependsOn: any[];
  provider: string;
  skip?: boolean;
}

export interface Integration {
  id: string;
  data: IntegrationData;
  tags?: {
    [key: string]: any;
  };
}

export interface Props {
  id: string;
}
