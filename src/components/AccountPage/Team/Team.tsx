import React from 'react';
import UsersTable from './UsersTable';
import Drawer from '../../common/Drawer';

const Team: React.FC = () => {
  return (
    <Drawer>
      <UsersTable />
    </Drawer>
  );
};

export default Team;
