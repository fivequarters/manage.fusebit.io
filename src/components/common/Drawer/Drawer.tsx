import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { Props } from '../../../interfaces/Drawer';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import * as SC from './styles';

const Drawer: React.FC<Props> = ({ links, children }) => {
  const { getRedirectLink } = useGetRedirectLink();
  const location = useLocation();

  return (
    <Box display="flex">
      <SC.DrawerComponent variant="permanent" anchor="left">
        {links?.map((link) => (
          <Box key={link.text} mb="8px">
            <Link to={getRedirectLink(link.href)}>
              <SC.Link color="default" active={location.pathname.indexOf(link.text.toLowerCase()) > 0}>
                {link.text}
              </SC.Link>
            </Link>
          </Box>
        ))}
      </SC.DrawerComponent>
      <Box mt="104px" width="100%">
        {children}
      </Box>
    </Box>
  );
};

export default Drawer;
