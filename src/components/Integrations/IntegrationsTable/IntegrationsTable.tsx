import BaseTable from '../../BaseTable/BaseTable';
import { useEntityTable } from '../../../hooks/useEntityTable';
import { usePagination } from '../../../hooks/usePagination';
import { Integration } from '../../../interfaces/integration';
import GetInstances from '../../TableRowComponent/GetInstances';
import NewIntegrationModal from '../NewIntegrationModal';
import DeleteIntegrationModal from '../DeleteIntegrationModal';
import { useModal } from '../../../hooks/useModal';
import { BaseTableRow } from '../../BaseTable/types';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import { useHistory } from 'react-router-dom';
import { trackEvent } from '../../../utils/analytics';

interface Props {
  headless: boolean;
  setHeadless: (value: boolean) => void;
  integrations?: {
    data: {
      items: Integration[];
    };
  };
}

const IntegrationsTable = ({ headless, setHeadless, integrations }: Props) => {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();
  const [newModalOpen, , toggleNewModal] = useModal();
  const [deleteModalOpen, setDeleteModal, toggleDeleteModal] = useModal();
  const { getRedirectLink } = useGetRedirectLink();
  const history = useHistory();

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
    installs: <GetInstances id={row.id} />,
  }));

  const handleClickRow = (row: BaseTableRow) => history.push(getRedirectLink(`/integration/${row.id}/develop`));

  const handleNewIntegration = () => {
    trackEvent('New Integration Button Clicked', 'Integrations');
    toggleNewModal();
  };

  return (
    <>
      <NewIntegrationModal onClose={toggleNewModal} open={newModalOpen} />
      <DeleteIntegrationModal
        onConfirm={handleRowDelete}
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
