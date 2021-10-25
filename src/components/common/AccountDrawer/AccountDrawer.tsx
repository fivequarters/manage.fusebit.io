import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box } from '@material-ui/core';
import * as SC from './styles';

interface Props {
  active?: 'settings' | 'team';
}

const AccountDrawer: React.FC<Props> = ({ active }) => {
  const { accountId } = useParams<{ accountId: string }>();

  const links = [
    {
      name: 'Settings',
      href: `/account/${accountId}/settings`,
      id: 'settings',
    },
    {
      name: `Team`,
      href: `/account/${accountId}/team`,
      id: 'team',
    },
  ];

  return (
    <SC.DrawerComponent variant="permanent" anchor="left">
      {links.map((link) => (
        <Box key={link.href} mb="8px">
          <Link to={link.href}>
            <SC.Link color="default" active={active === link.id}>
              {link.name}
            </SC.Link>
          </Link>
        </Box>
      ))}
    </SC.DrawerComponent>
  );
};

export default AccountDrawer;
