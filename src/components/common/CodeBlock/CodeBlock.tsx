import React from 'react';
import Highlight from 'react-highlight';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  width: 100%;

  .hljs-attr {
    color: #1e75b3;
  }

  .hljs-string,
  .hljs-number,
  .hljs-literal {
    color: #b35e14;
  }

  pre {
    font-size: 15px;
    line-height: 19px;
    padding: 40px;
    color: rgba(51, 51, 51, 0.75);
    background-color: rgba(51, 51, 51, 0.05);
    border-radius: 4px;
    max-height: 346px;
    overflow: auto;
  }
`;

interface Props {
  code: string | Record<any, any>;
  language?: string;
}

const CodeBlock: React.FC<Props> = ({ code, language = 'json' }) => {
  return (
    <StyledWrapper>
      <Highlight className={language}>{language === 'json' ? JSON.stringify(code, null, ' ') : code}</Highlight>
    </StyledWrapper>
  );
};

export default CodeBlock;
