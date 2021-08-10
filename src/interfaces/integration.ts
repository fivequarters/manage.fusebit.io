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
  skip: boolean;
  path: string;
  dependsOn: [];
  package: string;
}

export interface Integration {
  id: string;
  data: IntegrationData;
}
