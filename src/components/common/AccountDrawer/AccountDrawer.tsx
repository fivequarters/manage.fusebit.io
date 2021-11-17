import React from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { Box, Button, Drawer } from '@material-ui/core';

const StyledDrawerComponent = styled(Drawer)`
  > div {
    position: relative;
    padding: 104px 32px 104px 0;
    min-height: calc(100vh - var(--navbar-height));
    border-right: none;
    box-shadow: 25px 1px 30px -1px rgba(52, 72, 123, 0.05);
    margin-right: 93px;
  }
`;

const StyledLink = styled(Button)<{ active?: boolean }>`
  font-size: 16px;
  line-height: 18px;
  font-weight: ${(props) => (props.active ? 600 : 400)};
  background-color: ${(props) => props.active && 'var(--secondary-color)'};
  box-shadow: none;
  width: 254px;
  justify-content: left;
  padding: 11px 16px;
  transition: font-weight 0.1s linear;
  &:not(:last-child) {
    margin-bottom: 8px;
  }

  &:hover {
    background-color: var(--secondary-color);
    font-weight: 600;
  }
`;

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
    <StyledDrawerComponent variant="permanent" anchor="left">
      {links.map((link) => (
        <Box key={link.href} mb="8px">
          <Link to={link.href}>
            <StyledLink color="default" active={active === link.id}>
              {link.name}
            </StyledLink>
          </Link>
        </Box>
      ))}
    </StyledDrawerComponent>
  );
};

export default AccountDrawer;
