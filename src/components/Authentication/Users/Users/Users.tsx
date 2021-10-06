import React from 'react';
import { useContext } from '../../../../hooks/useContext';
import { useAccountUserGetAll } from '../../../../hooks/api/v1/account/user/useGetAll';
import { Account } from '../../../../interfaces/account';
import { UserCells } from '../../../../interfaces/tableRow';
import TableComponent from '../../../TableComponent';
import UsersTable from '../../UsersTable/UsersTable';

const Authentication: React.FC = () => {
  const { userData } = useContext();
  const { data: users } = useAccountUserGetAll<{ items: Account[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    params: 'include=all',
  });
  const [selectedCell, setSelectedCell] = React.useState<UserCells>(UserCells.NAME);

  const handlePreviousCellSelect = () => {
    if (selectedCell === UserCells.NAME) {
      setSelectedCell(UserCells.USER_ID);
    } else if (selectedCell === UserCells.EMAIL) {
      setSelectedCell(UserCells.NAME);
    } else {
      setSelectedCell(UserCells.EMAIL);
    }
  };

  const handleNextCellSelect = () => {
    if (selectedCell === UserCells.NAME) {
      setSelectedCell(UserCells.EMAIL);
    } else if (selectedCell === UserCells.EMAIL) {
      setSelectedCell(UserCells.USER_ID);
    } else {
      setSelectedCell(UserCells.NAME);
    }
  };

  return (
    <>
      <UsersTable />
      <TableComponent
        users={users}
        selectedCell={selectedCell}
        handleNextCellSelect={handleNextCellSelect}
        handlePreviousCellSelect={handlePreviousCellSelect}
      />
    </>
  );
};

export default Authentication;
