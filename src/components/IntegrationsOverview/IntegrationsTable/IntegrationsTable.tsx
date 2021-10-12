import { useHistory } from 'react-router-dom';
import BaseTable from '../../common/BaseTable/BaseTable';
import { useEntityTable } from '../../../hooks/useEntityTable';
import { usePagination } from '../../../hooks/usePagination';
import { Integration } from '../../../interfaces/integration';
import DeleteIntegrationModal from '../DeleteIntegrationModal';
import { useModal } from '../../../hooks/useModal';
import { BaseTableRow } from '../../common/BaseTable/types';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import { trackEvent } from '../../../utils/analytics';
import { useContext } from '../../../hooks/useContext';
import { useAccountIntegrationsGetAll } from '../../../hooks/api/v2/account/integration/useGetAll';
import GetInstalls from './GetInstalls';
import NewFeedModal from '../../common/NewFeedModal';

interface Props {
  headless: boolean;
  setHeadless: (value: boolean) => void;
}

const IntegrationsTable = ({ headless, setHeadless }: Props) => {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();
  const [newModalOpen, , toggleNewModal] = useModal();
  const [deleteModalOpen, setDeleteModal, toggleDeleteModal] = useModal();
  const { getRedirectLink } = useGetRedirectLink();
  const history = useHistory();
  const { userData } = useContext();

  const { data: integrations } = useAccountIntegrationsGetAll<{ items: Integration[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  const { loading, rows, selected, handleCheck, isSelected, handleSelectAllCheck, handleRowDelete } = useEntityTable({
    headless,
    setHeadless,
    integrations,
    page,
    setPage,
    rowsPerPage,
  });

  const tableRows = (rows as Integration[]).map((row) => ({
    id: row.id,
    name: row.id,
    installs: <GetInstalls id={row.id} />,
  }));

  const handleClickRow = (row: BaseTableRow) => history.push(getRedirectLink(`/integration/${row.id}/develop`));

  const handleNewIntegration = () => {
    trackEvent('New Integration Button Clicked', 'Integrations');
    toggleNewModal();
  };

  return (
    <>
      <NewFeedModal onClose={toggleNewModal} open={newModalOpen} isIntegration />
      <DeleteIntegrationModal
        onConfirm={() => handleRowDelete('Integration')}
        setOpen={setDeleteModal}
        open={deleteModalOpen}
        selected={selected}
      />
      <BaseTable
        emptyTableText="Your integrations list is empty, please create an integration"
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        entityName="integration"
        headers={[
          { id: 'name', value: 'Name' },
          { id: 'installs', value: 'Installs' },
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
      />
    </>
  );
};

export default IntegrationsTable;
