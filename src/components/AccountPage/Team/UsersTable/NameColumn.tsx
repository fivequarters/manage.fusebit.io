import { Avatar } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { Account } from '../../../../interfaces/account';
import clientImg from '../../../../assets/client.jpg';
import { useContext } from '../../../../hooks/useContext';
import * as SC from './styles';

interface Props {
  account: Account;
}

const NameColumn = ({ account }: Props) => {
  const { userData } = useContext();
  const isAdmin = userData.id === account.id;

  return (
    <Box display="flex" alignItems="center">
      <Avatar
        alt={`${account.firstName} ${account.lastName}`}
        src={isAdmin ? userData.picture || clientImg : clientImg}
        style={{ height: 26, width: 26 }}
      />
      <Box flex ml="16px" component="p" fontWeight="500" color="var(--primary-color)">
        {account.firstName} {account.lastName}
      </Box>
      {isAdmin && <SC.CellNameDetail>[me]</SC.CellNameDetail>}
    </Box>
  );
};

export default NameColumn;
