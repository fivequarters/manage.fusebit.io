import {Connector} from "./connector";

export interface ConnectorComponentProps {
    connector: Connector;
    onConnectorDelete: Function;
}