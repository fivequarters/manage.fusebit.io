import React from 'react';
import { ACCOUNT_SECTION_LINKS } from '../../../utils/constants';
import UsersTable from './UsersTable';
import Drawer from '../../common/Drawer';

const Team: React.FC = () => {
  return (
    <Drawer links={ACCOUNT_SECTION_LINKS}>
      <UsersTable />
    </Drawer>
  );
};

export default Team;
