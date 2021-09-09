export interface Props {
  onClose: Function;
  open: boolean;
  id: string;
  token: string;
  keyIsCopied?: boolean;
  setKeyIsCopied?: Function;
  showWarning?: boolean;
  setShowWarning?: Function;
  disableCopy?: boolean;
}
