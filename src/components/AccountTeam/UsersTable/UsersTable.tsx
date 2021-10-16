import { useHistory } from 'react-router-dom';
import DeleteUserModal from '../DeleteUserModal';
import NameColumn from './NameColumn';
import NewUserModal from '../NewUserModal';
import BaseTable from '../../BaseTable';
import { usePagination } from '../../../hooks/usePagination';
import { useModal } from '../../../hooks/useModal';
import { useContext } from '../../../hooks/useContext';
import { useAccountUserGetAll } from '../../../hooks/api/v1/account/user/useGetAll';
import { useEntityTable } from '../../../hooks/useEntityTable';
import { Account } from '../../../interfaces/account';
import { BaseTableRow } from '../../BaseTable/types';
import { trackEvent } from '../../../utils/analytics';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';

const UsersTable = () => {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();
  const [newModalOpen, , toggleNewModal] = useModal();
  const [deleteModalOpen, setDeleteModal, toggleDeleteModal] = useModal();
  const { getRedirectLink } = useGetRedirectLink();
  const history = useHistory();
  const { userData } = useContext();

  const { data: users, isLoading } = useAccountUserGetAll<{ items: Account[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    params: 'include=all',
  });

  const rows = (users?.data?.items || []).map((row) => ({
    id: row.id,
    name: <NameColumn account={row} />,
    email: row.primaryEmail,
    userId: row.id,
    hideCheckbox: row.id === userData.id,
  }));

  const { selected, handleCheck, isSelected, handleSelectAllCheck, handleRowDelete } = useEntityTable({
    page,
    setPage,
    rowsPerPage,
    rows,
  });

  const handleClickRow = (row: BaseTableRow) => history.push(getRedirectLink(`/authentication/${row.id}/overview`));

  const handleNewIntegration = () => {
    trackEvent('New User Button Clicked', 'Users');
    toggleNewModal();
  };

  return (
    <>
      <NewUserModal onClose={toggleNewModal} open={newModalOpen} />
      <DeleteUserModal
        onConfirm={() => handleRowDelete('Account')}
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
        loading={isLoading}
        onClickNew={handleNewIntegration}
        onDeleteAll={toggleDeleteModal}
        onSelectAll={handleSelectAllCheck}
        rows={rows}
        onSelectRow={handleCheck}
        isSelected={isSelected}
        selected={selected}
        onClickRow={handleClickRow}
        isAllChecked={rows.length > 1 ? selected.length === rows.length - 1 : false}
        hideCheckAll={rows.length === 1}
        actionsContainerProps={{
          mt: 0,
        }}
      />
    </>
  );
};

export default UsersTable;
