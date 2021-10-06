import { useHistory } from 'react-router-dom';
import BaseTable from '../../BaseTable/BaseTable';
import { useEntityTable } from '../../../hooks/useEntityTable';
import { usePagination } from '../../../hooks/usePagination';
import { useModal } from '../../../hooks/useModal';
import { BaseTableRow } from '../../BaseTable/types';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import { trackEvent } from '../../../utils/analytics';
import { useContext } from '../../../hooks/useContext';
import { Account } from '../../../interfaces/account';
import { useAccountUserGetAll } from '../../../hooks/api/v1/account/user/useGetAll';
import DeleteUserModal from '../DeleteUserModal';
import NameColumn from './NameColumn';
import NewUserModal from '../NewUserModal';

const UsersTable = () => {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();
  const [newModalOpen, , toggleNewModal] = useModal();
  const [deleteModalOpen, setDeleteModal, toggleDeleteModal] = useModal();
  const { getRedirectLink } = useGetRedirectLink();
  const history = useHistory();
  const { userData } = useContext();

  const { data: users } = useAccountUserGetAll<{ items: Account[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    params: 'include=all',
  });

  const { loading, rows, selected, handleCheck, isSelected, handleSelectAllCheck, handleRowDelete } = useEntityTable({
    users,
    page,
    setPage,
    rowsPerPage,
  });

  const tableRows = (rows as Account[]).map((row) => ({
    id: row.id,
    name: <NameColumn account={row} />,
    email: row.primaryEmail,
    userId: row.id,
    hideCheckbox: row.id === userData.id,
  }));

  const handleClickRow = (row: BaseTableRow) => history.push(getRedirectLink(`/authentication/${row.id}/overview`));

  const handleNewIntegration = () => {
    trackEvent('New User Button Clicked', 'Users');
    toggleNewModal();
  };

  return (
    <>
      <NewUserModal onClose={toggleNewModal} open={newModalOpen} />
      <DeleteUserModal
        onConfirm={() => handleRowDelete('A')}
        setOpen={setDeleteModal}
        open={deleteModalOpen}
        selected={selected}
      />
      <BaseTable
        noMainColumn
        emptyTableText="Your users list is empty, please create a user"
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        entityName="user"
        headers={[
          { id: 'name', value: 'Name' },
          { id: 'email', value: 'Email' },
          { id: 'userId', value: 'User-ID' },
        ]}
        loading={loading}
        onClickNew={handleNewIntegration}
        onDeleteAll={toggleDeleteModal}
        onSelectAll={handleSelectAllCheck}
        rows={tableRows}
        onSelectRow={handleCheck}
        isSelected={isSelected}
        selected={selected}
        onClickRow={handleClickRow}
        isAllChecked={tableRows.length > 1 ? selected.length === tableRows.length - 1 : false}
      />
    </>
  );
};

export default UsersTable;
