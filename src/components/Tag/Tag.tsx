import React, { ReactNode } from 'react';
import * as SC from './styles';

interface Props {
  children: ReactNode;
  onClick?: () => void;
}

const Tag: React.FC<Props> = ({ children, onClick }) => {
  return (
    <SC.Wrapper cursorPointer={!!onClick} onClick={onClick && onClick}>
      <SC.Tag>{children}</SC.Tag>
    </SC.Wrapper>
  );
};

export default Tag;
