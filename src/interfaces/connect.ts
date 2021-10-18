import { Integration } from './integration';

export interface Props {
  onClose: Function;
  onDelete: Function;
  onChange?: () => void;
  open: boolean;
  id: string;
  name: string;
  token: string;
  keyIsCopied?: boolean;
  setKeyIsCopied?: Function;
  showWarning?: boolean;
  setShowWarning?: Function;
  disableCopy?: boolean;
  integration?: Integration;
}
