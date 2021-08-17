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
  provider: string;
  dependsOn: [];
}

export interface Integration {
  id: string;
  data: IntegrationData;
}

export interface Props {
  id: string;
}
