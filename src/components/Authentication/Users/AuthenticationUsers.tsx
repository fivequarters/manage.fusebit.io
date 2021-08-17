import React from 'react';
import TabComponent from '../../TabComponent';
import Users from './Users';

const AuthenticationUsers: React.FC = () => {
  return (
    <>
      <TabComponent tabNames={['Users']} tabObjects={[<Users />]} />
    </>
  );
};

export default AuthenticationUsers;
