import { useHistory } from 'react-router-dom';
import BaseTable from '../../BaseTable/BaseTable';
import { useEntityTable } from '../../../hooks/useEntityTable';
import { usePagination } from '../../../hooks/usePagination';
import { useModal } from '../../../hooks/useModal';
import { BaseTableRow } from '../../BaseTable/types';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import { trackEvent } from '../../../utils/analytics';
import { useContext } from '../../../hooks/useContext';
import { useAccountConnectorsGetAll } from '../../../hooks/api/v2/account/connector/useGetAll';
import { Connector } from '../../../interfaces/connector';
import GetIdentities from '../../TableRowComponent/GetIdentities';
import DeleteConnectorModal from '../DeleteConnectorModal';
import NewFeedModal from '../../common/NewFeedModal';

interface Props {
  headless: boolean;
  setHeadless: (value: boolean) => void;
}

const ConnectorsTable = ({ headless, setHeadless }: Props) => {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();
  const [newModalOpen, , toggleNewModal] = useModal();
  const [deleteModalOpen, setDeleteModal, toggleDeleteModal] = useModal();
  const { getRedirectLink } = useGetRedirectLink();
  const history = useHistory();
  const { userData } = useContext();

  const { data: connectors } = useAccountConnectorsGetAll<{ items: Connector[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  const { loading, rows, selected, handleCheck, isSelected, handleSelectAllCheck, handleRowDelete } = useEntityTable({
    headless,
    setHeadless,
    connectors,
    page,
    setPage,
    rowsPerPage,
  });

  const tableRows = (rows as Connector[]).map((row) => ({
    id: row.id,
    name: row.id,
    type: row.tags['fusebit.provider'],
    identities: <GetIdentities id={row.id} />,
  }));

  const handleClickRow = (row: BaseTableRow) => history.push(getRedirectLink(`/connector/${row.id}/configure`));

  const handleNewIntegration = () => {
    trackEvent('New Connector Button Clicked', 'Connectors');
    toggleNewModal();
  };

  return (
    <>
      <NewFeedModal onClose={toggleNewModal} open={newModalOpen} isIntegration={false} />
      <DeleteConnectorModal
        onConfirm={() => handleRowDelete('C')}
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

export default ConnectorsTable;
