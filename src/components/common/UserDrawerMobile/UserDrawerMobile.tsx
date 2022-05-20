import { Box, Button, Drawer } from '@material-ui/core';
import styled from 'styled-components';
import * as CSC from '@components/globalStyle';
import { signOut } from '@hooks/useAuthContext';
import CloseIcon from '@material-ui/icons/Close';
import MainUserInfo from '../MainUserInfo/MainUserInfo';
import UserMenuLinks from '../UserMenuLinks';

const StyledContent = styled.div`
  position: relative;
  padding: 50px 24px 50px 32px;
  border-radius: 8px 0 0 8px;
`;

interface Props {
  open: boolean;
  onClose: () => void;
}

const UserDrawerMobile: React.FC<Props> = ({ open, onClose }: Props) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <StyledContent>
        <CSC.CloseWrapper aria-label="close" onClick={onClose}>
          <CloseIcon />
        </CSC.CloseWrapper>
        <MainUserInfo onAccountSwitch={onClose} />
        <UserMenuLinks showAll />
        <Box textAlign="right" mt="104px">
          <Button
            onClick={() => signOut()}
            style={{ marginLeft: 'auto' }}
            variant="outlined"
            size="medium"
            color="primary"
          >
            Log Out
          </Button>
        </Box>
      </StyledContent>
    </Drawer>
  );
};

export default UserDrawerMobile;
