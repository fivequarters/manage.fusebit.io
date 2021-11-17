import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  margin-top: -5px;
  margin-left: -5px;

  & > * {
    margin-top: 5px;
    margin-left: 5px;
  }
`;

interface Props {
  children: ReactNode;
}

const List: React.FC<Props> = ({ children }) => {
  return <StyledWrapper>{children}</StyledWrapper>;
};

export default List;
