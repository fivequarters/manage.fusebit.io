import React from 'react';
import * as SC from './styles';
import copyIcon from '../../assets/copy.svg';
import { Props } from '../../interfaces/copyLine';
import { useCopy } from '../../hooks/useCopy';

const CopyLine: React.FC<Props> = ({ text, highlightedText, horizontalScrollbar, warning, onCopy, disableCopy }) => {
  const [fadeChange, setFadeChange] = React.useState(false);
  const { handleCopy, copiedLine } = useCopy();

  const handleClick = () => {
    if (!disableCopy) {
      handleCopy(text);
      onCopy && onCopy();
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
        {highlightedText && <span className="unselectable">$</span>}
        {highlightedText
          ? text.split(' ').map((word) => {
              let foundWord = false;
              highlightedText.split(' ').forEach((wordToHightlight) => {
                if (wordToHightlight.match(word)) {
                  foundWord = true;
                }
              });
              if (foundWord) {
                return <strong key={word}>{word}</strong>;
              } else {
                return word + ' ';
              }
            })
          : text}
      </SC.LineInstruction>
      <SC.CopySuccess copy={copiedLine}>Copied to clipboard!</SC.CopySuccess>
    </SC.LineInstructionWrapper>
  );
};

export default CopyLine;
