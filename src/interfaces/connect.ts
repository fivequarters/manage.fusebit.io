export interface Props {
  onClose: Function;
  onDelete: Function;
  open: boolean;
  id: string;
  token: string;
  keyIsCopied?: boolean;
  setKeyIsCopied?: Function;
  showWarning?: boolean;
  setShowWarning?: Function;
  disableCopy?: boolean;
}
