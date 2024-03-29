import { Connector } from './connector';
import { Integration } from './integration';

interface uischemaElement {
  type: string;
  scope: string;
  label: string;
  options?: {
    [key: string]: string | boolean;
  };
}

interface schemaElement {
  type: string;
  minLength?: number;
}

export interface EntityComponent {
  name: string;
  entityType: string;
  entityId: string;
  dependsOn: any[];
  provider: string;
  skip?: boolean;
}

export interface ConnectorEntity extends Connector {
  entityType: 'connector';
  entityId: string;
}

export interface IntegrationEntity extends Integration {
  entityType: 'integration';
  entityId: string;
}

export type Entity = ConnectorEntity | IntegrationEntity;

export interface Snippet {
  id: string;
  name: string;
  description: string;
  code: string;
}

export interface ParsedSnippet extends Snippet {
  icon: string;
  connectorName: string;
  feedId: string;
}

export interface Feed {
  id: string;
  name: string;
  private?: boolean;
  description: string;
  smallIcon: string;
  largeIcon: string;
  version: string;
  outOfPlan: boolean;
  tags: {
    service: string;
    catalog: string;
  };
  resources: {
    configureAppDocUrl?: string;
    connectorSDKDocUrl?: string;
    sampleConfig?: {
      isEnabled?: boolean;
      isGetEnabled?: boolean;
      isPostEnabled?: boolean;
      terms: {
        postSuccess?: string;
        postFail?: string;
        getFail?: string;
        itemName?: string;
        properties?: {
          name?: string;
          label?: string;
        }[];
      };
    };
  };
  configuration: {
    title: string;
    schema: {
      type: string;
      properties: {
        [key: string]: schemaElement;
      };
      required?: string[];
    };
    uischema: {
      type: string;
      label: string;
      elements: {
        type: string;
        elements: uischemaElement[];
      };
    };
    data: {
      [key: string]: {
        [key: string]: string;
      };
    };
    entities: Record<string, Entity>;
    components?: EntityComponent[];
  };
  snippets?: Snippet[];
}

export type ParsedFeed = Omit<Feed, 'configuration'> & {
  configuration: Omit<Feed['configuration'], 'entities'> & { entities: Entity[] };
};
