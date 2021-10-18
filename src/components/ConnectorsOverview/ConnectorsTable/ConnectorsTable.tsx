import { useHistory } from 'react-router-dom';
import BaseTable from '../../common/BaseTable/BaseTable';
import { useEntityTable } from '../../../hooks/useEntityTable';
import { usePagination } from '../../../hooks/usePagination';
import { useModal } from '../../../hooks/useModal';
import { BaseTableRow } from '../../common/BaseTable/types';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import { trackEvent } from '../../../utils/analytics';
import { useContext } from '../../../hooks/useContext';
import { useAccountConnectorsGetAll } from '../../../hooks/api/v2/account/connector/useGetAll';
import { Connector } from '../../../interfaces/connector';
import DeleteConnectorModal from '../DeleteConnectorModal';
import GetIdentities from './GetIdentities';
import useQueryParam from '../../../hooks/useQueryParam';
import CreateConnectorModal from '../CreateConnectorModal';

const ConnectorsTable = () => {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();
  const [newModalOpen, setNewModal, toggleNewModal] = useModal();
  const [deleteModalOpen, setDeleteModal, toggleDeleteModal] = useModal();
  const { getRedirectLink } = useGetRedirectLink();
  const history = useHistory();
  const { userData } = useContext();
  const { data: connectors, isLoading } = useAccountConnectorsGetAll<{ items: Connector[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  useQueryParam({
    onSet: () => {
      setNewModal(true);
    },
    param: 'key',
  });

  const rows = (connectors?.data?.items || []).map((row) => ({
    id: row.id,
    name: row.id,
    type: row.tags['fusebit.provider'],
    identities: <GetIdentities id={row.id} />,
  }));

  const { selected, handleCheck, isSelected, handleSelectAllCheck, handleRowDelete } = useEntityTable({
    page,
    setPage,
    rowsPerPage,
    rows,
  });

  const handleClickRow = (row: BaseTableRow) => history.push(getRedirectLink(`/connector/${row.id}/configure`));

  const handleNewIntegration = () => {
    trackEvent('New Connector Button Clicked', 'Connectors', {});
    toggleNewModal();
  };

  return (
    <>
      <CreateConnectorModal onClose={toggleNewModal} open={newModalOpen} />
      <DeleteConnectorModal
        onConfirm={() => handleRowDelete('Connector')}
        setOpen={setDeleteModal}
        open={deleteModalOpen}
        selected={selected}
      />
      <BaseTable
        emptyTableText="Your connectors list is empty, please create an integration"
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        entityName="connector"
        headers={[
          { id: 'name', value: 'Name' },
          { id: 'type', value: 'Type' },
          { id: 'identities', value: 'Identities' },
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

export default ConnectorsTable;
