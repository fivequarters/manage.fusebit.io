import { Feed } from "./feed";

export interface Props {
    open: boolean;
    onClose: Function;
    onSubmit: Function;
    feed: Feed[];
    isIntegration?: boolean;
}