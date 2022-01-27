import { Feed, Snippet } from './feed';

export interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (feed: Feed, data: Data, snippet?: Snippet) => void;
  isIntegration?: boolean;
  isSnippet?: boolean;
  isFork?: boolean;
  hasConnectorDependency?: (feed: Feed) => boolean;
}

export interface Data {
  [key: string]: any;
}
