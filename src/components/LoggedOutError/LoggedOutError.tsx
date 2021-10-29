import React from 'react';
import { Button } from '@material-ui/core';
import fusebit from '@assets/fusebit-logo.svg';
import warning from '@assets/warning-red.svg';
import { signIn } from '@hooks/useAuthContext';
import * as SC from './styles';

const LoggedOutError: React.FC = () => (
  <SC.Wrapper>
    <SC.Background />
    <SC.Fusebit src={fusebit} alt="fusebit" height="37px" width="144px" />
    <SC.Warning src={warning} alt="warning" height="40" width="40" />
    <SC.Title>Logged out</SC.Title>
    <SC.Description>We have encountered an error, which requires that you log in to your account again.</SC.Description>
    <Button onClick={() => signIn()} style={{ width: '200px' }} variant="contained" color="primary" size="large">
      Log In
    </Button>
  </SC.Wrapper>
);

export default LoggedOutError;
