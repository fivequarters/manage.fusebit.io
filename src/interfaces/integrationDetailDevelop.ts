import { InnerConnector } from './integration';

export interface FinalConnector extends InnerConnector {
  missing?: boolean;
  id: string;
  tokenSignature?: string;
  isApplication?: boolean;
  data?: object;
  tags?: {
    [key: string]: any;
  };
  version?: string;
  expires?: string;
}
