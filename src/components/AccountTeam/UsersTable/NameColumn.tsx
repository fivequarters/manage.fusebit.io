import { Avatar } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import styled from 'styled-components';
import { Account } from '@interfaces/account';
import accountImg from '@assets/account.svg';
import { useAuthContext } from '@hooks/useAuthContext';

const StyledCellNameDetail = styled.p`
  color: #959595;
  font-weight: 500;
  margin-left: 5px;
`;

interface Props {
  account: Account;
}

const NameColumn = ({ account }: Props) => {
  const { userData } = useAuthContext();
  const isAdmin = userData.userId === account.id;

  return (
    <Box display="flex" alignItems="center">
      <Avatar
        alt={`${account.firstName} ${account.lastName}`}
        src={isAdmin ? userData.picture || accountImg : accountImg}
        style={{ height: 26, width: 26 }}
      />
      <Box flex ml="16px" component="p" fontWeight="500" color="var(--primary-color)">
        {account.firstName} {account.lastName}
      </Box>
      {isAdmin && <StyledCellNameDetail>[me]</StyledCellNameDetail>}
    </Box>
  );
};

export default NameColumn;
