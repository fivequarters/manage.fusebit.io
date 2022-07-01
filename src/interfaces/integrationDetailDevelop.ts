import { InnerConnector } from './integration';

export interface FinalConnector extends InnerConnector {
  missing?: boolean;
  id: string;
  entityId: string;
  tokenSignature?: string;
  isApplication?: boolean;
  data?: {
    configuration: object;
    files: {
      'package.json': string;
      [x: string]: string;
    };
    handler: string;
    id: string;
  };
  tags?: {
    [key: string]: any;
  };
  version?: string;
  expires?: string;
}
