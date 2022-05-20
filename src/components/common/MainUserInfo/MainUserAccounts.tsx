import { useAuthContext } from '@hooks/useAuthContext';
import { AccountListItem } from '@interfaces/account';
import { Box } from '@material-ui/core';
import styled from 'styled-components';
import check from '@assets/check.svg';
import CompanyTitle from '@components/common/CompanyTitle';
import { replaceDash } from '@utils/utils';

const StyledSubscriptionWrapper = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  margin: 8px 0;
  border-radius: 4px;
  padding: 10px;
  transition: all 0.25s linear;

  span {
    margin-right: 6px;
    font-weight: ${(props) => (props.active ? 500 : 400)};
  }

  &:hover {
    cursor: pointer;
    background: var(--secondary-color);
  }

  @media only screen and (max-width: 880px) {
    background: ${(props) => props.active && 'var(--secondary-color)'};
  }
`;

const StyledAccountSeparator = styled.div`
  width: calc(100% - 8px);
  height: 2px;
  background: var(--secondary-color);
  margin: 4px 0 20px auto;

  @media only screen and (max-width: 880px) {
    width: 100%;
  }
`;

const StyledCheck = styled.img`
  margin-left: 12px;
`;

interface Props {
  accounts: AccountListItem[];
  onAccountSwitch: (acc: AccountListItem) => void;
  isMobile?: boolean;
}

const MainUserAccounts = ({ accounts, onAccountSwitch, isMobile }: Props) => {
  const { userData } = useAuthContext();

  return (
    <Box mb={isMobile && '24px'}>
      {accounts?.map((acc, i, arr) => (
        <Box key={acc.userId} display="flex" flexDirection="column">
          <div>
            <CompanyTitle>
              <Box ml={!isMobile && '8px'}>{acc.company}</Box>
            </CompanyTitle>
            {acc.subscriptions.map((sub) => {
              const isActive = sub.id === userData.subscriptionId;
              return (
                <StyledSubscriptionWrapper
                  active={isActive}
                  onClick={() =>
                    onAccountSwitch({
                      ...acc,
                      subscriptionId: sub.id,
                      subscriptionName: sub.displayName,
                    })
                  }
                  key={sub.id}
                >
                  <span>{sub.displayName}</span> - {replaceDash(sub.id)}
                  {isActive && <StyledCheck alt="checked" src={check} height="16" width="16" />}
                </StyledSubscriptionWrapper>
              );
            })}
          </div>
          {i < arr.length - 1 && <StyledAccountSeparator />}
        </Box>
      ))}
    </Box>
  );
};

export default MainUserAccounts;
