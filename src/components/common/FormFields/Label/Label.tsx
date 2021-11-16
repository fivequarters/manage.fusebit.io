import React from 'react';
import styled from 'styled-components';

const StyledLabel = styled.h4`
  font-size: 16px;
  line-height: 18px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 16px;
  margin-top: 0;
`;

interface Props {
  children: string;
}

const Label: React.FC<Props> = ({ children }) => {
  return <StyledLabel>{children} </StyledLabel>;
};

export default Label;
