import React from 'react';
import Highlight from 'react-highlight';
import * as SC from './styles';
import '../../../node_modules/highlight.js/styles/magula.css';

interface Props {
  code: string;
}

const CodeBlock: React.FC<Props> = ({ code }) => {
  return (
    <SC.Wrapper>
      <Highlight className="javascript">{code}</Highlight>
    </SC.Wrapper>
  );
};

export default CodeBlock;
