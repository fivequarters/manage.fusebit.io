import { Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

interface Props {
  command: string;
  keyWords: string;
}

const StyledCommandWord = styled(Typography)<{ keyWord?: boolean }>`
  font-family: courier;
  font-weight: ${(props) => props.keyWord && '600'};
  margin: ${(props) => props.keyWord && '0 8px'};
`;

const HighlightedCommand: React.FC<Props> = ({ command, keyWords }) => {
  return (
    <>
      <StyledCommandWord color="textPrimary" keyWord>
        $
      </StyledCommandWord>

      {command
        .toLowerCase()
        .split(' ')
        .map((word) => {
          let foundWord = false;
          keyWords.split(' ').forEach((wordToHightlight) => {
            if (wordToHightlight.match(word)) {
              foundWord = true;
            }
          });
          if (foundWord) {
            return (
              <StyledCommandWord key={word} color="textPrimary" keyWord>
                {word}
              </StyledCommandWord>
            );
          }
          return <StyledCommandWord key={word}>{word}</StyledCommandWord>;
        })}
    </>
  );
};

export default HighlightedCommand;
