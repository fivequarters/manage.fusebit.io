import React from 'react';
import * as SC from './styles';

interface Props {
  children: string;
}

const Label: React.FC<Props> = ({ children }) => {
  return <SC.Label>{children} </SC.Label>;
};

export default Label;
