export interface Integration {
    id: string;
    data: {
        configuration: {
            connectors: {
                connectorName: {
                    package: string;
                    connector: string;
                }
            },
            creation: {
             tags: object,
             autoStep: boolean
            }
        },
        files: object
    }
}
