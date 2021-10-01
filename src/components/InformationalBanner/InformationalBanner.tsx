import React from 'react';
import * as SC from './styles';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const InformationalBanner: React.FC<Props> = ({ children, className }) => {
  return (
    <SC.Banner className={className}>
      <SC.Description>{children}</SC.Description>
    </SC.Banner>
  );
};

export default InformationalBanner;
