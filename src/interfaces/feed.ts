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
}

export interface IntegrationEntity extends Integration {
  entityType: 'integration';
}

export type Entity = ConnectorEntity | IntegrationEntity;

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
}

export type ParsedFeed = Omit<Feed, 'configuration'> & {
  configuration: Omit<Feed['configuration'], 'entities'> & { entities: Entity[] };
};
