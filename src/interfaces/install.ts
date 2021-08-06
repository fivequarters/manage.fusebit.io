interface InstallInstance {
    id: string,
    data: object,
    tags: object,
    version: string,
    expires: string
}

export interface Install {
    items: InstallInstance[];
    total: number;
    next: string;
}