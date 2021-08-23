import React from 'react';
import * as SC from './styles';
import copyIcon from '../../assets/copy.svg';
import { Props } from '../../interfaces/copyLine';

const CopyLine: React.FC<Props> = ({ text, highlightedText, horizontalScrollbar }) => {
  const [fadeChange, setFadeChange] = React.useState(false);
  const [copiedLine, setCopiedLine] = React.useState(false);
  let timeout: NodeJS.Timeout;

  const handleCopy = (text: string) => {
    clearTimeout(timeout);
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    setCopiedLine(true);
    timeout = setTimeout(() => {
      setCopiedLine(false);
    }, 3000);
  };
  return (
    <SC.LineInstructionWrapper
      onMouseLeave={() => setFadeChange(false)}
      onMouseEnter={() => setFadeChange(true)}
      onClick={() => handleCopy(text)}
    >
      <SC.LineInstructionCopy>
        <img src={copyIcon} alt="copy" height="16" width="16" />
      </SC.LineInstructionCopy>
      <SC.LineInstructionFade change={fadeChange} />
      <SC.LineInstruction horizontalScrollbar={horizontalScrollbar}>
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
