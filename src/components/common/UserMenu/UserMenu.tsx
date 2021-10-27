import { Button, Menu, Box } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import styled from 'styled-components';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useAuthContext, signOut } from '../../../hooks/useAuthContext';
import accountImg from '../../../assets/account.svg';
import rightArrow from '../../../assets/arrow-right-black.svg';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import useAnchor from '../../../hooks/useAnchor';

const StyledButton = styled(Button)<{ active: boolean }>`
  color: white;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.active ? 'rgba(215, 229, 255, 0)' : '#D7E5FF66')};
  ${(props) =>
    props.active &&
    `
    background-color: #D7E5FF66
  `}
`;

const StyledUserDropdown = styled.div`
  padding: 0px 32px 24px;
`;

const StyledUserDropdownCompany = styled.h5`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: var(--primary-color);
  text-transform: uppercase;
  margin-bottom: 24px;
`;

const StyledUserDropdownInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  cursor: pointer;

  @media only screen and (max-width: 880px) {
    margin-top: 48px;
  }
`;

const StyledUserDropdownInfoImage = styled.img`
  height: 38px;
  width: 38px;
  object-fit: contain;
  border-radius: 50%;
  margin-right: 16px;
`;

const StyledUserDropdownPersonalInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledUserDropdownInfoName = styled.h4`
  font-size: 16px;
  line-height: 18px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 4px;
  margin-top: auto;
`;

const StyledUserDropdownInfoEmail = styled.div`
  font-size: 14px;
  line-height: 16px;
  color: var(--black);
  margin-bottom: auto;
`;

const StyledUserDropdownStatus = styled.span`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px 24px;
  border-radius: 4px;
  background-color: var(--secondary-color);
  text-decoration: none;
  margin-bottom: 24px;

  &:hover {
    cursor: pointer;
  }

  @media only screen and (max-width: 880px) {
    width: 238px;
  }
`;

const StyledUserDropdownStatusTitle = styled.div`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: var(--black);
  margin-bottom: 8px;
`;

const StyledUserDropdownStatusId = styled.div`
  font-size: 14px;
  line-height: 16px;
  color: var(--black);

  @media only screen and (max-width: 880px) {
    width: 155px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const StyledUserDropdownStatusArrow = styled.img`
  height: 12px;
  width: 12px;
  object-fit: contain;
  margin-left: auto;
`;

const StyledUserDropdownLinksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

const StyledUserDropdownLink = styled.span<{ noMargin?: boolean }>`
  font-size: 14px;
  line-height: 16px;
  color: var(--black);
  text-decoration: none;
  width: max-content;
  transition: all 0.25s linear;
  ${(props) => (props.noMargin ? '' : 'margin-bottom: 16px;')}

  &:hover {
    color: var(--primary-color);
  }
`;

const StyledUserImg = styled.img`
  height: 24px;
  width: 24px;
  border-radius: 50%;
  object-fit: contain;
`;

const UserMenu = () => {
  const { userData } = useAuthContext();
  const { getRedirectLink } = useGetRedirectLink();
  const history = useHistory();
  const { accountId } = useParams<{ accountId: string }>();
  const { anchorEl, handleClick, handleClose } = useAnchor();

  const handleOnClickEmail = () => {
    history.push(getRedirectLink(`/authentication/${userData.userId}/overview`));
  };

  return (
    <>
      <StyledButton
        active={!!anchorEl}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="large"
        startIcon={<StyledUserImg src={userData.picture || accountImg} />}
        endIcon={anchorEl ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        variant="text"
        color="inherit"
      >
        {process.env.REACT_APP_DEPLOYMENT_KEY}
      </StyledButton>
      <Menu
        style={{ top: '100px', margin: '0 0 0 -88px' }}
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={handleClose}
      >
        <StyledUserDropdown>
          <StyledUserDropdownCompany>{userData.company}</StyledUserDropdownCompany>
          <StyledUserDropdownInfo onClick={handleOnClickEmail}>
            <StyledUserDropdownInfoImage src={userData.picture || accountImg} alt="user" height="38" width="38" />
            <StyledUserDropdownPersonalInfo>
              <StyledUserDropdownInfoName>
                {userData.firstName} {userData.lastName}
              </StyledUserDropdownInfoName>
              <StyledUserDropdownInfoEmail>{userData.primaryEmail}</StyledUserDropdownInfoEmail>
            </StyledUserDropdownPersonalInfo>
          </StyledUserDropdownInfo>
          <Link to={getRedirectLink('/integrations/overview')}>
            <StyledUserDropdownStatus>
              <div>
                <StyledUserDropdownStatusTitle>{process.env.REACT_APP_DEPLOYMENT_KEY}</StyledUserDropdownStatusTitle>
                <StyledUserDropdownStatusId>{userData.subscriptionId}</StyledUserDropdownStatusId>
              </div>
              <StyledUserDropdownStatusArrow src={rightArrow} alt="right arrow" height="12" width="12" />
            </StyledUserDropdownStatus>
          </Link>
          <StyledUserDropdownLinksWrapper>
            <Link to={`/account/${accountId}/settings`}>
              <StyledUserDropdownLink>Settings</StyledUserDropdownLink>
            </Link>
            <Link to={`/account/${accountId}/team`}>
              <StyledUserDropdownLink noMargin>Team</StyledUserDropdownLink>
            </Link>
          </StyledUserDropdownLinksWrapper>
          <Box>
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
      </Menu>
    </>
  );
};

export default UserMenu;
