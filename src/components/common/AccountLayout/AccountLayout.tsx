import { Box, Container } from '@material-ui/core';
import React from 'react';
import AccountDrawer from '@components/common/AccountDrawer';

interface Props {
  active: React.ComponentProps<typeof AccountDrawer>['active'];
}

const AccountLayout: React.FC<Props> = ({ children, active }) => {
  return (
    <Container maxWidth="lg">
      <Box display="flex">
        <AccountDrawer active={active} />
        <Box pt="104px" width="100%">
          {children}
        </Box>
      </Box>
    </Container>
  );
};

export default AccountLayout;
