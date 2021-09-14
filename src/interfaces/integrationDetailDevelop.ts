export interface ListComponentProps {
  connector: FinalConnector;
  onChange?: () => void;
  onConnectorDelete: Function;
  onLinkConnectorClick?: Function;
  linkConnector?: boolean;
}

export interface FinalConnector {
  missing?: boolean;
  id: string;
  name?: string;
  tokenSignature?: string;
  isApplication?: boolean;
  data?: object;
  tags?: {
    [key: string]: any;
  };
  version?: string;
  expires?: string;
}
