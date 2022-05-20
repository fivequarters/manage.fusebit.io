import { Box, Menu, useMediaQuery } from '@material-ui/core';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import accountImg from '@assets/account.svg';
import rightArrow from '@assets/arrow-right-black.svg';
import { useAuthContext } from '@hooks/useAuthContext';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import { useAccountUserGetOne } from '@hooks/api/v1/account/user/useGetOne';
import { Account, AccountListItem } from '@interfaces/account';
import CompanyTitle from '@components/common/CompanyTitle';
import MainUserAccounts from '@components/common/MainUserInfo/MainUserAccounts';
import { replaceDash } from '@utils/utils';

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
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #dae8ff;
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

const StyledUserDropdownStatusId = styled.div`
  font-size: 14px;
  line-height: 16px;
  color: var(--black);
  max-width: 176px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  strong {
    font-weight: 500;
  }

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
  margin-left: 12px;
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

interface Props {
  onAccountSwitch: () => void;
}

const MainUserInfo = ({ onAccountSwitch }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { userData, setUserData } = useAuthContext();
  const { getRedirectLink } = useGetRedirectLink();
  const history = useHistory();
  const { data: currentUser } = useAccountUserGetOne<Account>({
    enabled: userData.token,
    userId: userData.userId,
    accountId: userData.accountId,
  });
  const isMobile = useMediaQuery('(max-width: 880px)');

  const handleOnClickEmail = () => {
    history.push(getRedirectLink(`/authentication/${userData.userId}/overview`));
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccountSwitch = (acc: AccountListItem) => {
    setUserData({
      ...userData,
      ...acc,
    });
    localStorage.setItem('activeAccount', JSON.stringify(acc));
    setAnchorEl(null);
    onAccountSwitch();
  };

  return (
    <>
      <StyledUserDropdownInfo onClick={handleOnClickEmail}>
        <StyledUserDropdownInfoImage src={userData.picture || accountImg} alt="user" height="38" width="38" />
        <StyledUserDropdownPersonalInfo>
          <StyledUserDropdownInfoName>
            {currentUser?.data.firstName} {currentUser?.data.lastName}
          </StyledUserDropdownInfoName>
          <StyledUserDropdownInfoEmail>{currentUser?.data.primaryEmail}</StyledUserDropdownInfoEmail>
        </StyledUserDropdownPersonalInfo>
      </StyledUserDropdownInfo>
      {isMobile ? (
        <MainUserAccounts isMobile onAccountSwitch={handleAccountSwitch} />
      ) : (
        <>
          <Box mb="12px">
            <CompanyTitle />
          </Box>
          <StyledUserDropdownStatus onClick={handleClick}>
            <StyledUserDropdownStatusId>
              <strong>{userData.subscriptionName}</strong> - {replaceDash(userData?.subscriptionId || '')}
            </StyledUserDropdownStatusId>
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
              <MainUserAccounts onAccountSwitch={handleAccountSwitch} />
            </StyledAccountsWrapper>
          </StyledMenu>
        </>
      )}
    </>
  );
};

export default MainUserInfo;
