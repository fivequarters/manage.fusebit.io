export interface Connector {
    id: string;
    data: object;
    tags: {
        [key: string]: any;
    };
    version: string;
    expires: string;
}
