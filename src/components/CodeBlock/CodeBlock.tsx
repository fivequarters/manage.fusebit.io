import React from 'react';
import Highlight from 'react-highlight';
import * as SC from './styles';

interface Props {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<Props> = ({ code, language = 'json' }) => {
  return (
    <SC.Wrapper>
      <Highlight className={language}>{code}</Highlight>
    </SC.Wrapper>
  );
};

export default CodeBlock;
