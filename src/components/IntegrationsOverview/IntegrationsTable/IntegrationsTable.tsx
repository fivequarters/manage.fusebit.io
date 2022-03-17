import { useHistory } from 'react-router-dom';
import BaseTable from '@components/common/BaseTable/BaseTable';
import { useEntityTable } from '@hooks/useEntityTable';
import { usePagination } from '@hooks/usePagination';
import { Integration } from '@interfaces/integration';
import DeleteIntegrationModal from '@components/IntegrationsOverview/DeleteIntegrationModal';
import { useModal } from '@hooks/useModal';
import { BaseTableRow } from '@components/common/BaseTable/types';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import { trackEventMemoized } from '@utils/analytics';
import { useAuthContext } from '@hooks/useAuthContext';
import { useAccountIntegrationsGetAll } from '@hooks/api/v2/account/integration/useGetAll';
import useQueryParam from '@hooks/useQueryParam';
import useFirstTimeVisitor from '@hooks/useFirstTimeVisitor';
import CreateIntegrationModal from '@components/IntegrationsOverview/CreateIntegrationModal';
import ForkIntegrationModal from '@components/IntegrationsOverview/ForkIntegrationModal';
import { useFeedQuery } from '@hooks/useFeedQuery';
import GetInstalls from './GetInstalls';

const IntegrationsTable = () => {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();
  const [newModalOpen, setNewModal, toggleNewModal] = useModal();
  const { forkFeedUrl } = useFeedQuery();
  const [forkModalOpen, setForkModal] = useModal(!!forkFeedUrl);
  const [deleteModalOpen, setDeleteModal, toggleDeleteModal] = useModal();
  const { getRedirectLink } = useGetRedirectLink();
  const history = useHistory();
  const { userData } = useAuthContext();
  const { data: integrations, isLoading } = useAccountIntegrationsGetAll<{ items: Integration[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const { setFirstTimeVisitor } = useFirstTimeVisitor({
    onFirstTimeVisitor: () => setNewModal(true),
    entities: integrations?.data.items,
  });

  useQueryParam({
    onSet: () => {
      setNewModal(true);
      setFirstTimeVisitor(false);
    },
    param: 'key',
  });

  const rows = (integrations?.data?.items || []).map((row) => ({
    id: row.id,
    name: row.id,
    installs: <GetInstalls id={row.id} />,
  }));

  const { selected, handleCheck, isSelected, handleSelectAllCheck, handleRowDelete } = useEntityTable({
    page,
    setPage,
    rowsPerPage,
    rows,
  });

  const handleClickRow = (row: BaseTableRow) => history.push(getRedirectLink(`/integration/${row.id}/develop`));

  const handleNewIntegration = () => {
    trackEventMemoized('New Integration Button Clicked', 'Integrations', {});
    toggleNewModal();
  };

  return (
    <>
      <ForkIntegrationModal onClose={() => setForkModal(false)} open={forkModalOpen} />
      <CreateIntegrationModal onClose={() => setNewModal(false)} open={newModalOpen} />
      <DeleteIntegrationModal
        onConfirm={() => handleRowDelete('Integration')}
        setOpen={setDeleteModal}
        open={deleteModalOpen}
        selected={selected}
      />
      <BaseTable
        emptyTableText="Your integration list is empty, please create an integration"
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        entityName="integration"
        headers={[
          { id: 'name', value: 'Name' },
          { id: 'installs', value: 'Installs' },
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
      />
    </>
  );
};

export default IntegrationsTable;
