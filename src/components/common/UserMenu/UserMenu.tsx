import { Button, Box } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import styled from 'styled-components';
import * as CSC from '@components/globalStyle';
import { useAuthContext, signOut } from '@hooks/useAuthContext';
import accountImg from '@assets/account.svg';
import useAnchor from '@hooks/useAnchor';
import MainUserInfo from '@components/common/MainUserInfo/MainUserInfo';
import UserMenuLinks from '@components/common/UserMenuLinks';

const StyledButton = styled(Button)<{ active: boolean }>`
  color: white;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.active ? 'rgba(215, 229, 255, 0)' : '#D7E5FF66')};
  ${(props) =>
    props.active &&
    `
    background-color: #D7E5FF66 !important;
  `}
`;

const StyledUserDropdown = styled.div`
  padding: 0px 32px 24px;
`;

const StyledUserImg = styled.img`
  height: 24px;
  width: 24px;
  border-radius: 50%;
  object-fit: contain;
`;

const UserMenu = () => {
  const { userData } = useAuthContext();
  const { anchorEl, handleClickAnchor, handleCloseMenu } = useAnchor();

  return (
    <>
      <StyledButton
        active={!!anchorEl}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClickAnchor}
        size="large"
        startIcon={<StyledUserImg src={userData.picture || accountImg} />}
        endIcon={anchorEl ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        variant="text"
        color="inherit"
      >
        {userData.subscriptionName !== 'Default' ? userData.subscriptionName : 'Production'}
      </StyledButton>
      <CSC.StyledMenu
        PaperProps={{
          style: {
            marginTop: '17px',
          },
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={handleCloseMenu}
      >
        <StyledUserDropdown>
          <Box m="24px 0">
            <MainUserInfo onAccountSwitch={handleCloseMenu} />
          </Box>
          <UserMenuLinks />
          <Box textAlign="right" mt="24px">
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
        </StyledUserDropdown>
      </CSC.StyledMenu>
    </>
  );
};

export default UserMenu;
