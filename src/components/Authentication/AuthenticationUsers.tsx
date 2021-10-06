import React from 'react';
import TabComponent from '../TabComponent';
import UsersTable from './AccountsTable';

const AuthenticationUsers: React.FC = () => {
  return (
    <>
      <TabComponent tabNames={['Users']} tabObjects={[<UsersTable key="usersTable" />]} />
    </>
  );
};

export default AuthenticationUsers;
