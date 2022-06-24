import { Tags } from './tags';

export interface IntegrationData {
  components: InnerConnector[];
  files: {
    'package.json': string;
    [x: string]: string;
  };
  handler: string;
  componentTags: {
    [key: string]: any;
  };
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
  tags: Tags;
  dateAdded: string;
  dateModified: string;
}

export interface Props {
  id: string;
}
