import { Box, useMediaQuery } from '@material-ui/core';
import { useMemo, useState } from 'react';
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
import * as CSC from '@components/globalStyle';
import { useAccountGetAllAccounts } from '@hooks/api/v1/account/account/useGetAllAccounts';

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
  max-width: 172px;
  overflow: hidden;
  text-overflow: ellipsis;

  @media only screen and (max-width: 880px) {
    max-width: 226px;
  }
`;

const StyledUserDropdownStatus = styled.span`
  display: flex;
  align-items: center;
  width: 226px;
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
  width: 100%;
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

const StyledAccountsWrapper = styled.div`
  position: relative;
  padding: 10px 15px;
`;

interface Props {
  onAccountSwitch: () => void;
}

const MainUserInfo = ({ onAccountSwitch }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { userData, switchAccount } = useAuthContext();
  const { getRedirectLink } = useGetRedirectLink();
  const history = useHistory();
  const { data: currentUser } = useAccountUserGetOne<Account>({
    enabled: userData.token,
    userId: userData.userId,
    accountId: userData.accountId,
  });
  const { data: accounts, isLoading } = useAccountGetAllAccounts();
  const isMobile = useMediaQuery('(max-width: 880px)');

  const allowSubscriptionSelection = useMemo(() => {
    if (accounts) {
      return userData.accounts && (userData?.accounts?.length > 1 || accounts?.[0]?.subscriptions?.length > 1);
    }

    return isLoading;
  }, [accounts, userData, isLoading]);

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
    switchAccount(acc);
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
        <MainUserAccounts accounts={accounts} isLoading={isLoading} isMobile onAccountSwitch={handleAccountSwitch} />
      ) : (
        <>
          <Box mb="12px">
            <CompanyTitle />
          </Box>
          <StyledUserDropdownStatus onClick={handleClick}>
            <StyledUserDropdownStatusId>
              {/* Hardcode Production for now, when we have different
              display names than Default remove the hardcoded text */}
              <strong>{userData.subscriptionName !== 'Default' ? userData.subscriptionName : 'Production'}</strong> (
              {userData?.subscriptionId})
            </StyledUserDropdownStatusId>
            {allowSubscriptionSelection && (
              <StyledUserDropdownStatusArrow src={rightArrow} alt="right arrow" height="12" width="12" />
            )}
          </StyledUserDropdownStatus>
          <CSC.StyledMenu
            id="accounts"
            aria-labelledby="accounts-dropdown"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl) && Boolean(allowSubscriptionSelection)}
            onClose={handleClose}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 122, horizontal: isLoading ? 100 : 395 }}
          >
            <StyledAccountsWrapper>
              <MainUserAccounts accounts={accounts} isLoading={isLoading} onAccountSwitch={handleAccountSwitch} />
            </StyledAccountsWrapper>
          </CSC.StyledMenu>
        </>
      )}
    </>
  );
};

export default MainUserInfo;
