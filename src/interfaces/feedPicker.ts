export interface Props {
    open: boolean;
    onClose: Function;
    onSubmit: Function;
    isIntegration?: boolean;
}

export interface Data {
    [key: string]: any;
}