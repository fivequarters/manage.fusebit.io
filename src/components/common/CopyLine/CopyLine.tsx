import React from 'react';
import copyIcon from '@assets/copy.svg';
import { Props } from '@interfaces/copyLine';
import { useCopy } from '@hooks/useCopy';
import * as SC from './styles';

// TODO: Refactor this component and remove extra logic as highlightedText. Use Typography From MUI instead of plain text.

const CopyLine: React.FC<Props> = ({ text, highlightedText, horizontalScrollbar, warning, onCopy, disableCopy }) => {
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
        <p>
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
                }
                return `${word} `;
              })
            : text}
        </p>
      </SC.LineInstruction>
      <SC.CopySuccess copy={copiedLine}>Copied to clipboard!</SC.CopySuccess>
    </SC.LineInstructionWrapper>
  );
};

export default CopyLine;
