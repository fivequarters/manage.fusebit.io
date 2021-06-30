export interface IntegrationData {
    configuration: {
        connectors: InnerConnector,
        creation: {
         tags: object,
         autoStep: boolean
        }
    },
    files: object
}

export interface InnerConnector {
    [key: string]: {
        package: string;
        connector: string;
    }
}

export interface Integration {
    id: string;
    data: IntegrationData
}
