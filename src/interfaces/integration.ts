export interface Integration {
    id: string;
    data: {
        configuration: {
            connectors: {
                [key: string]: {
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
