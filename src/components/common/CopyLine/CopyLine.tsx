import React from 'react';
import copyIcon from '@assets/copy.svg';
import { useCopy } from '@hooks/useCopy';
import * as SC from './styles';

interface Props {
  text: string;
  children?: React.ReactNode;
  horizontalScrollbar?: boolean;
  warning?: boolean;
  onCopy?: Function;
  disableCopy?: boolean;
}

const CopyLine: React.FC<Props> = ({ text, children, horizontalScrollbar, warning, onCopy, disableCopy }) => {
  const [fadeChange, setFadeChange] = React.useState(false);
  const { handleCopy, copiedLine } = useCopy();

  const handleClick = () => {
    if (!disableCopy) {
      handleCopy(text);
      if (onCopy) {
        onCopy();
      }
    }
  };

  return (
    <SC.LineInstructionWrapper
      onMouseLeave={() => setFadeChange(false)}
      onMouseEnter={() => setFadeChange(true)}
      onClick={handleClick}
      disableCursorPointer={disableCopy}
    >
      <SC.LineInstructionCopy disabled={disableCopy}>
        <img src={copyIcon} alt="copy" height="16" width="16" />
      </SC.LineInstructionCopy>
      <SC.LineInstructionFade disabled={disableCopy} warning={warning} change={fadeChange} />
      <SC.LineInstruction warning={warning} horizontalScrollbar={horizontalScrollbar}>
        {children || <SC.Text>{text}</SC.Text>}
      </SC.LineInstruction>
      <SC.CopySuccess copy={copiedLine}>Copied to clipboard!</SC.CopySuccess>
    </SC.LineInstructionWrapper>
  );
};

export default CopyLine;
