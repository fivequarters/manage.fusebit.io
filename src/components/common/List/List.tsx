import React, { ReactNode } from 'react';
import * as SC from './styles';

interface Props {
  children: ReactNode;
}

const List: React.FC<Props> = ({ children }) => {
  return <SC.Wrapper>{children}</SC.Wrapper>;
};

export default List;
