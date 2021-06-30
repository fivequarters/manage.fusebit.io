import { FuseInitToken } from "./fuseInitToken";

export interface Props {
    open: boolean;
    onClose: Function;
    integration: string;
    token: string | FuseInitToken;
}