import React from 'react';
import { Button } from '@material-ui/core';
import fusebit from '@assets/fusebit-logo.svg';
import warning from '@assets/warning-red.svg';
import styled from 'styled-components';
import background from '@assets/background-small.jpg';
import { useQuery } from '@hooks/useQuery';
import { useHistory } from 'react-router-dom';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 850px;
  margin: 0 auto;
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
  margin-bottom: 102px;

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
  text-align: center;
  color: var(--black);

  @media only screen and (max-width: 500px) {
    font-size: 40px;
    line-height: 50px;
  }
`;

const StyledDescription = styled.p`
  font-size: 16px;
  line-height: 22px;
  color: var(--black);
  text-align: center;

  span {
    font-weight: 600;
    color: var(--primary-color);
    cursor: pointer;
  }

  @media only screen and (max-width: 500px) {
    font-size: 14px;
    line-height: 20px;
  }
`;

const LoggedOutError: React.FC = () => {
  const history = useHistory();
  const query = useQuery();
  const error = query.get('error');
  const isInvalidInviteToken = query.get('invalidInviteToken') === 'true';

  return (
    <StyledWrapper>
      <StyledBackground />
      <StyledFusebit src={fusebit} alt="fusebit" height="37px" width="144px" />
      <StyledWarning src={warning} alt="warning" height="40" width="40" />
      <StyledTitle>{isInvalidInviteToken ? 'Your invite link has expired' : 'Logged out'}</StyledTitle>
      <StyledDescription>
        {isInvalidInviteToken
          ? 'To keep your account safe, invite links expire after 8 hours and can only be used once. To get a new invite link, please reach out to your teammate.'
          : ' We have encountered an error, which requires that you log in to your account again.'}
      </StyledDescription>
      {}
      {isInvalidInviteToken ? (
        <>
          <StyledDescription>
            Want to create an individual account instead? <span onClick={() => history.push('/')}>Log in Now</span>
          </StyledDescription>
          <StyledDescription>(Don't worry, you can still join a team with the same account)</StyledDescription>
        </>
      ) : (
        error && <StyledDescription>{error}</StyledDescription>
      )}
      <Button
        onClick={() => history.push('/')}
        style={{ width: '200px', marginTop: '40px' }}
        variant="contained"
        color="primary"
        size="large"
      >
        Log In
      </Button>
    </StyledWrapper>
  );
};

export default LoggedOutError;
