import React from 'react';
import styled from 'styled-components';

export const StyledText = styled.span<{ active?: boolean }>`
  font-size: 20px;
  font-weight: 300;
  margin: 0;
  color: white;

  ${(props) => props.active && `font-weight: 600;`}
`;

interface Props {
  active?: boolean;
}

const BreadCrumText: React.FC<Props> = ({ children, active }) => {
  return <StyledText active={active}>{children}</StyledText>;
};

export default BreadCrumText;
