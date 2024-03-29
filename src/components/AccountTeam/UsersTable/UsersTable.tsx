import { useHistory } from 'react-router-dom';
import BaseTable from '@components/common/BaseTable/BaseTable';
import { useEntityTable } from '@hooks/useEntityTable';
import { usePagination } from '@hooks/usePagination';
import { useModal } from '@hooks/useModal';
import { BaseTableRow } from '@components/common/BaseTable/types';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import { trackEventMemoized } from '@utils/analytics';
import { useAuthContext } from '@hooks/useAuthContext';
import { Account } from '@interfaces/account';
import { useAccountUserGetAll } from '@hooks/api/v1/account/user/useGetAll';
import DeleteUserModal from '../DeleteUserModal';
import InviteUserModal from '../InviteUserModal';
import NameColumn from './NameColumn';

const UsersTable = () => {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();
  const [inviteModalOpen, , toggleInviteModal] = useModal();
  const [deleteModalOpen, setDeleteModal, toggleDeleteModal] = useModal();
  const { getRedirectLink } = useGetRedirectLink();
  const history = useHistory();
  const { userData } = useAuthContext();

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
    hideCheckbox: row.id === userData.userId,
  }));

  const { selected, handleCheck, isSelected, handleSelectAllCheck, handleRowDelete } = useEntityTable({
    page,
    setPage,
    rowsPerPage,
    rows,
  });

  const handleClickRow = (row: BaseTableRow) => history.push(getRedirectLink(`/authentication/${row.id}/overview`));

  const handleInviteUser = () => {
    trackEventMemoized('Invite Team Member Button Clicked', 'Team');
    toggleInviteModal();
  };

  return (
    <>
      <InviteUserModal onClose={toggleInviteModal} open={inviteModalOpen} />
      <DeleteUserModal
        onConfirm={() => {
          handleRowDelete('Account');
          trackEventMemoized('Remove Member Clicked', 'Team');
        }}
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
        entityNamePlural="users"
        headers={[
          { id: 'name', value: 'Name' },
          { id: 'email', value: 'Email' },
          { id: 'userId', value: 'User-ID' },
        ]}
        loading={isLoading}
        newButtonText="Invite Team Member"
        onClickNew={handleInviteUser}
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
