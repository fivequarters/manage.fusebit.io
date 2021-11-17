import React from 'react';
import { Button } from '@material-ui/core';
import fusebit from '@assets/fusebit-logo.svg';
import warning from '@assets/warning-red.svg';
import { signIn } from '@hooks/useAuthContext';
import styled from 'styled-components';
import background from '@assets/background-small.jpg';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
`;

const StyledBackground = styled.div`
  width: 100vw;
  height: 23px;
  background-image: url(${background});
  background-repeat: no-repeat;
  background-size: cover;
`;

const StyledFusebit = styled.img`
  width: 144px;
  height: 37px;
  object-fit: contain;
  margin-top: 62px;
  margin-bottom: 140px;

  @media only screen and (max-width: 500px) {
    width: 125px;
    height: 32px;
    margin-bottom: 120px;
    margin-top: 56px;
  }
`;

const StyledWarning = styled.img`
  height: 40px;
  width: 40px;
  object-fit: contain;
`;

const StyledTitle = styled.h1`
  font-size: 56px;
  line-height: 58px;
  font-weight: 600;
  margin-bottom: 32px;
  color: var(--black);

  @media only screen and (max-width: 500px) {
    font-size: 40px;
    line-height: 50px;
  }
`;

const StyledDescription = styled.p`
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 68px;
  color: var(--black);
  text-align: center;

  @media only screen and (max-width: 500px) {
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 64px;
  }
`;

const LoggedOutError: React.FC = () => {
  return (
    <StyledWrapper>
      <StyledBackground />
      <StyledFusebit src={fusebit} alt="fusebit" height="37px" width="144px" />
      <StyledWarning src={warning} alt="warning" height="40" width="40" />
      <StyledTitle>Logged out</StyledTitle>
      <StyledDescription>
        We have encountered an error, which requires that you log in to your account again.
      </StyledDescription>
      <Button onClick={() => signIn()} style={{ width: '200px' }} variant="contained" color="primary" size="large">
        Log In
      </Button>
    </StyledWrapper>
  );
};

export default LoggedOutError;
