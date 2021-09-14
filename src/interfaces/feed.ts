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

interface EntityComponent {
  name: string;
  entityType: string;
  entityId: string;
  dependsOn: any[];
  provider: string;
  skip?: boolean;
}

export interface Entity {
  entityType: string;
  id: string;
  isApplication?: boolean;
  data: {
    id?: string;
    files?: { [key: string]: any };
    handler?: string;
    configuration?: {
      [key: string]: any;
    };
    components?: EntityComponent[];
    componentTags?: {
      [key: string]: any;
    };
  };
  tags: {
    [key: string]: string;
  };
}

export interface Feed {
  id: string;
  name: string;
  description: string;
  smallIcon: string;
  largeIcon: string;
  version: string;
  tags: {
    service: string;
    catalog: string;
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
