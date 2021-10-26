import { InnerConnector, Integration } from './integration';

export interface ListComponentProps {
  connector: FinalConnector;
  id?: string;
  onChange?: () => void;
  onConnectorDelete: Function;
  onLinkConnectorClick?: Function;
  linkConnector?: boolean;
  integration?: Integration;
}

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
