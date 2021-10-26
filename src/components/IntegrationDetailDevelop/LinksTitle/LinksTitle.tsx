import React from 'react';
import styled from 'styled-components';

export const StyledTitle = styled.h5`
  font-size: 12px;
  line-height: 14px;
  font-weight: 300;
  color: var(--black);
  margin-bottom: 16px;
`;

const LinksTitle = () => {
  return <StyledTitle>Learn More:</StyledTitle>;
};

export default LinksTitle;
