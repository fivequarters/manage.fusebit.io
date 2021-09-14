export interface Props {
  text: string;
  highlightedText?: string;
  horizontalScrollbar?: boolean;
  warning?: boolean;
  onCopy?: Function;
  disableCopy?: boolean;
}
