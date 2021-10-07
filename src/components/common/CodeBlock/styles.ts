import styled from 'styled-components';

export const Wrapper = styled.div`
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
