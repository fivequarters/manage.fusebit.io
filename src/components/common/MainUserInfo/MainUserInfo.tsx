import { Auth0Token, FusebitProfile } from '@interfaces/auth0Token';
import { Menu } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import jwt_decode from 'jwt-decode';
import { useLoader } from '@hooks/useLoader';
import accountImg from '@assets/account.svg';
import rightArrow from '@assets/arrow-right-black.svg';
import { useAuthContext } from '@hooks/useAuthContext';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';

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

const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    transform: translateX(calc(-100%) - 20px) !important;
  }
`;

const StyledAccountsWrapper = styled.div`
  position: relative;
  padding: 10px 15px;
`;

const StyledAccWrapper = styled.div<{ active: boolean }>`
  margin: 8px 0;
  padding: 10px;
  background: ${(props) => props.active && 'var(--secondary-color)'};
  transition: all 0.25s linear;

  &:hover {
    cursor: pointer;
    background: var(--secondary-color);
  }
`;

const MainUserInfo = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [accounts, setAccount] = useState<FusebitProfile[]>();
  const { userData, authUser } = useAuthContext();
  const { getRedirectLink } = useGetRedirectLink();
  const { createLoader, removeLoader } = useLoader();
  const history = useHistory();

  useEffect(() => {
    if (userData.token) {
      const decoded = jwt_decode<Auth0Token>(userData.token || '');
      const fusebitProfile = decoded['https://fusebit.io/profile'];
      setAccount(fusebitProfile.accounts);
    }
  }, [userData]);

  const handleOnClickEmail = () => {
    history.push(getRedirectLink(`/authentication/${userData.userId}/overview`));
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccountSwitch = (acc: FusebitProfile) => {
    createLoader();
    authUser(userData.token || '', acc, () => {
      removeLoader();
    });
  };

  return (
    <>
      <StyledUserDropdownInfo onClick={handleOnClickEmail}>
        <StyledUserDropdownInfoImage src={userData.picture || accountImg} alt="user" height="38" width="38" />
        <StyledUserDropdownPersonalInfo>
          <StyledUserDropdownInfoName>
            {userData.firstName} {userData.lastName}
          </StyledUserDropdownInfoName>
          <StyledUserDropdownInfoEmail>{userData.primaryEmail}</StyledUserDropdownInfoEmail>
        </StyledUserDropdownPersonalInfo>
      </StyledUserDropdownInfo>
      <StyledUserDropdownStatus onClick={handleClick}>
        <div>
          <StyledUserDropdownStatusTitle>{process.env.REACT_APP_DEPLOYMENT_KEY}</StyledUserDropdownStatusTitle>
          <StyledUserDropdownStatusId>{userData.subscriptionId}</StyledUserDropdownStatusId>
        </div>
        <StyledUserDropdownStatusArrow src={rightArrow} alt="right arrow" height="12" width="12" />
      </StyledUserDropdownStatus>
      <StyledMenu
        PaperProps={{
          style: {
            transform: anchorEl ? 'translateX(calc(-100% - 50px))' : '',
          },
        }}
        id="accounts"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledAccountsWrapper>
          {accounts?.map((acc, i) => {
            return (
              <StyledAccWrapper
                onClick={() => handleAccountSwitch(acc)}
                key={acc.userId}
                active={userData.accountId === acc.accountId && userData.subscriptionId === acc.subscriptionId}
              >
                <div>Account {i}</div>
                <div>{acc.accountId}</div>
                <div>{acc.subscriptionId}</div>
              </StyledAccWrapper>
            );
          })}
        </StyledAccountsWrapper>
      </StyledMenu>
    </>
  );
};

export default MainUserInfo;
