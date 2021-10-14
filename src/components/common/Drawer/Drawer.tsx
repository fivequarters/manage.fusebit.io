import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Container } from '@material-ui/core';
import * as SC from './styles';

interface Props {
  children: React.ReactNode;
  active?: 'settings' | 'team';
}

const Drawer: React.FC<Props> = ({ children, active }) => {
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
    <Container maxWidth="lg">
      <Box display="flex">
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
        <Box pt="104px" width="100%">
          {children}
        </Box>
      </Box>
    </Container>
  );
};

export default Drawer;
