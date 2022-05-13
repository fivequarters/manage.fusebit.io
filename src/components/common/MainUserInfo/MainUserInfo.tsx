import { Auth0Token } from '@interfaces/auth0Token';
import { Menu } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import jwt_decode from 'jwt-decode';
import accountImg from '@assets/account.svg';
import rightArrow from '@assets/arrow-right-black.svg';
import { useAuthContext } from '@hooks/useAuthContext';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import { useAccountUserGetOne } from '@hooks/api/v1/account/user/useGetOne';
import { useAxios } from '@hooks/useAxios';
import { Account, AccountListItem, AccountSubscriptions } from '@interfaces/account';
import { getAllSubscriptions } from '@hooks/api/v1/account/account/useGetAllSubscriptions';
import { getOne } from '@hooks/api/v1/account/account/useGetOne';
import { getMe } from '@hooks/api/v1/account/account/useGetMe';

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

const StyledAccWrapper = styled.div<{ active: boolean }>`
  margin: 8px 0;
  border-radius: 4px;
  padding: 10px;
  background: ${(props) => props.active && 'var(--secondary-color)'};
  transition: all 0.25s linear;

  &:hover {
    cursor: pointer;
    background: var(--secondary-color);
  }
`;

interface Props {
  onAccountSwitch: () => void;
}

const MainUserInfo = ({ onAccountSwitch }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [accounts, setAccounts] = useState<AccountListItem[]>();
  const { userData, setUserData } = useAuthContext();
  const { getRedirectLink } = useGetRedirectLink();
  const history = useHistory();
  const { axios } = useAxios();
  const { data: currentUser } = useAccountUserGetOne<Account>({
    enabled: userData.token,
    userId: userData.userId,
    accountId: userData.accountId,
  });

  useEffect(() => {
    if (userData.token && !accounts) {
      const decoded = jwt_decode<Auth0Token>(userData.token || '');
      const fusebitProfile = decoded['https://fusebit.io/profile'];
      const profilePromises = fusebitProfile?.accounts?.map((acc) => {
        return {
          subscriptionsPromise: getAllSubscriptions<AccountSubscriptions>(axios, acc),
          accountPromise: getOne<Account>(axios, acc),
          isValid: getMe(axios, acc),
        };
      });
      const fullAccounts: AccountListItem[] = [];
      Promise.all(profilePromises || []).then((res) => {
        res.forEach(async (account, i) => {
          // checks if the user still has acces to the account in case he was recently deleted
          const isValid = await account.isValid;
          if (isValid.success) {
            const accountData = await account.accountPromise;
            const subscriptionsData = await account.subscriptionsPromise;
            const acc: AccountListItem = {
              ...fusebitProfile?.accounts?.[i],
              subscriptions: subscriptionsData.data.items,
              company: accountData.data.displayName,
              displayName: accountData.data.displayName,
            };
            fullAccounts.push(acc);
          }
        });
      });

      setAccounts(fullAccounts);
    }
  }, [userData, axios, accounts]);

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
          {accounts?.map((acc) => {
            return (
              <div key={acc.userId}>
                <div>{acc.company}</div>
                {acc.subscriptions.map((sub) => {
                  return (
                    <StyledAccWrapper
                      onClick={() => handleAccountSwitch({ ...acc, subscriptionId: sub.id })}
                      key={sub.id}
                      active={userData.subscriptionId === sub.id}
                    >
                      {sub.displayName} ({sub.id})
                    </StyledAccWrapper>
                  );
                })}
              </div>
            );
          })}
        </StyledAccountsWrapper>
      </StyledMenu>
    </>
  );
};

export default MainUserInfo;
