import { Feed } from './feed';

export interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (feed: Feed, data: Data) => void;
  isIntegration?: boolean;
}

export interface Data {
  [key: string]: any;
}
