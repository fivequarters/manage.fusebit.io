import React from 'react';
import styled from 'styled-components';
import disclaimer from '@assets/disclaimer.svg';
import { Box } from '@material-ui/core';

const StyledDisclaimer = styled.p`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: var(--black);
  margin-left: 14px;

  strong {
    font-weight: 500;
    line-height: 16px;
  }
`;

const StyledDisclaimerIcon = styled.div`
  min-height: 20px;
  min-width: 20px;
  background-image: url(${disclaimer});
  background-size: contain;
  background-repeat: no-repeat;
`;

interface Props {
  children: React.ReactNode;
}

const SecurityDisclaimer = ({ children }: Props) => {
  return (
    <Box display="flex" alignItems="center">
      <StyledDisclaimerIcon />
      <StyledDisclaimer>{children}</StyledDisclaimer>
    </Box>
  );
};

export default SecurityDisclaimer;
