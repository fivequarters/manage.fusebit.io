import React from 'react';
import copyIcon from '@assets/copy.svg';
import { Props } from '@interfaces/copyLine';
import { useCopy } from '@hooks/useCopy';
import styled from 'styled-components';

const StyledLineInstructionWrapper = styled.div<{ disableCursorPointer?: boolean }>`
  position: relative;
  margin-bottom: 16px;

  &:hover {
    cursor: ${(props) => (props.disableCursorPointer ? 'default' : 'pointer')};

    & > div {
      opacity: 1;
    }
  }

  @media only screen and (max-width: 870px) {
    max-width: none;
  }
`;

const StyledLineInstruction = styled.div<{ horizontalScrollbar?: boolean; warning?: boolean }>`
  position: relative;
  height: 50px;
  padding: 16px;
  border: 0;
  margin: 0;
  outline: rgba(255, 255, 255, 0);
  border-radius: 4px;
  border: ${(props) => props.warning && '2px solid #F83420'};
  background-color: var(--secondary-color);
  white-space: nowrap;
  font-family: 'Courier';
  font-size: 16px;
  line-height: 18px;
  width: 100%;
  color: var(--black);
  display: flex;

  & > p {
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }

  & > span {
    color: var(--primary-color);
    font-weight: 400;
    margin: 0 10px;
  }

  & > strong {
    color: var(--primary-color);
    font-weight: 400;
    margin: 0 10px;
  }

  .unselectable {
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
  }

  @media only screen and (max-width: 1250px) {
    font-size: 14px;
    line-height: 16px;
    width: 100%;
  }
`;

const StyledLineInstructionFade = styled.div<{
  change: boolean;
  onlyMobileVisible?: boolean;
  warning?: boolean;
  disabled?: boolean;
}>`
  display: ${(props) => props.onlyMobileVisible && 'none'};
  position: absolute;
  right: 0;
  top: 0;
  height: 50px;
  width: ${(props) => (props.change && !props.disabled ? '300px' : '60px')};
  background-image: linear-gradient(to left, #eff5ff 10%, rgba(255, 255, 255, 0) 100%);
  border-radius: 4px 4px 0 0;
  z-index: 1;
  transition: width 0.25s linear;

  @media only screen and (max-width: 1250px) {
    right: -2px;
    display: ${(props) => props.onlyMobileVisible && 'block'};
    width: 300px !important;
  }

  @media only screen and (max-width: 350px) {
    width: 100% !important;
  }

  ${(props) =>
    props.warning &&
    `
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      border: 2px solid #F83420;
      border-left: 0;
  `}
`;

const StyledLineInstructionCopy = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  visibility: ${(props) => (props.disabled ? 'hidden' : 'visible')};
  right: 0;
  top: 0;
  height: 50px;
  width: 70px;
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: var(--primary-color);
  z-index: 2;
  opacity: 0;
  transition: all 0.25s linear;

  @media only screen and (max-width: 1250px) {
    opacity: 1;
  }
`;

const StyledCopySuccess = styled.p<{ copy: boolean }>`
  position: absolute;
  right: 0;
  bottom: -35px;
  font-size: 14px;
  line-height: 16px;
  color: var(--grey);
  opacity: ${(props) => (props.copy ? 1 : 0)};
  visibility: ${(props) => (props.copy ? 'visible' : 'hidden')};
  margin-left: auto;
  transition: all 0.5s linear;
`;

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
    <StyledLineInstructionWrapper
      onMouseLeave={() => setFadeChange(false)}
      onMouseEnter={() => setFadeChange(true)}
      onClick={handleClick}
      disableCursorPointer={disableCopy}
    >
      <StyledLineInstructionCopy disabled={disableCopy}>
        <img src={copyIcon} alt="copy" height="16" width="16" />
      </StyledLineInstructionCopy>
      <StyledLineInstructionFade disabled={disableCopy} warning={warning} change={fadeChange} />
      <StyledLineInstruction warning={warning} horizontalScrollbar={horizontalScrollbar}>
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
      </StyledLineInstruction>
      <StyledCopySuccess copy={copiedLine}>Copied to clipboard!</StyledCopySuccess>
    </StyledLineInstructionWrapper>
  );
};

export default CopyLine;
