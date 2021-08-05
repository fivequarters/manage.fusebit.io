export interface ConnectorComponentProps {
    connector: FinalConnector;
    onConnectorDelete: Function;
    onLinkConnectorClick?: Function;
    linkConnector?: boolean;
}

export interface FinalConnector {
    missing?: boolean;
    id: string;
    data?: object;
    tags?: {
        [key: string]: any;
    };
    version?: string;
    expires?: string;
}