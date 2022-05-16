import { Box, Menu } from '@material-ui/core';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import * as CSC from '@components/globalStyle';
import accountImg from '@assets/account.svg';
import rightArrow from '@assets/arrow-right-black.svg';
import { useAuthContext } from '@hooks/useAuthContext';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import { useAccountUserGetOne } from '@hooks/api/v1/account/user/useGetOne';
import { Account, AccountListItem } from '@interfaces/account';
import { useAccountGetAllAccounts } from '@hooks/api/v1/account/account/useGetAllAccounts';
import CompanyTitle from '../CompanyTitle';

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
  margin-left: 24px;
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

const StyledSubscriptionWrapper = styled.div`
  margin: 8px 0;
  border-radius: 4px;
  padding: 10px;
  transition: all 0.25s linear;

  &:hover {
    cursor: pointer;
    background: var(--secondary-color);
  }
`;

const StyledSubscriptionName = styled.h5`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: var(--primary-color);
  text-transform: uppercase;
  max-width: 238px;
  margin: 0;
`;

const StyledAccWrapper = styled.div`
  &:not(:last-child) {
    margin-bottom: 16px;
  }
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
  const { data: accounts, isLoading } = useAccountGetAllAccounts();

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
      <Box mb="12px">
        <CompanyTitle />
      </Box>
      <StyledUserDropdownStatus onClick={handleClick}>
        <div>
          <StyledUserDropdownStatusTitle>{userData.subscriptionName}</StyledUserDropdownStatusTitle>
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
          {isLoading ? (
            <CSC.Spinner />
          ) : (
            accounts?.map((acc) => {
              return (
                <StyledAccWrapper key={acc.userId}>
                  <StyledSubscriptionName>{acc.company}</StyledSubscriptionName>
                  {acc.subscriptions.map((sub) => {
                    return (
                      <StyledSubscriptionWrapper
                        onClick={() =>
                          handleAccountSwitch({ ...acc, subscriptionId: sub.id, subscriptionName: sub.displayName })
                        }
                        key={sub.id}
                      >
                        {sub.displayName} ({sub.id})
                      </StyledSubscriptionWrapper>
                    );
                  })}
                </StyledAccWrapper>
              );
            })
          )}
        </StyledAccountsWrapper>
      </StyledMenu>
    </>
  );
};

export default MainUserInfo;
