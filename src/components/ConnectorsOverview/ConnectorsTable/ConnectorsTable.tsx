import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import BaseTable from '@components/common/BaseTable/BaseTable';
import { useEntityTable } from '@hooks/useEntityTable';
import { usePagination } from '@hooks/usePagination';
import { useModal } from '@hooks/useModal';
import { BaseTableRow } from '@components/common/BaseTable/types';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import { trackEventMemoized } from '@utils/analytics';
import { useAuthContext } from '@hooks/useAuthContext';
import { useAccountConnectorsGetAll } from '@hooks/api/v2/account/connector/useGetAll';
import { Connector } from '@interfaces/connector';
import useQueryParam from '@hooks/useQueryParam';
import DeleteConnectorModal from '../DeleteConnectorModal';
import CreateConnectorModal from '../CreateConnectorModal';
import GetIdentities from './GetIdentities';
import GetCredentialTypes from './GetCredentialTypes';
import GetConnectorIcons from './GetConnectorIcons';
import GetRelatedIntegrations from './GetRelatedIntegrations';

const ConnectorsTable = () => {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();
  const [newModalOpen, setNewModal, toggleNewModal] = useModal();
  const [deleteModalOpen, setDeleteModal, toggleDeleteModal] = useModal();
  const { getRedirectLink } = useGetRedirectLink();
  const history = useHistory();
  const { userData } = useAuthContext();
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
    type: row.tags['fusebit.service'],
    identities: <GetIdentities id={row.id} />,
    createdAt: format(new Date(row.dateAdded), 'MM/dd/yyyy'),
    lastModified: format(new Date(row.dateModified), 'MM/dd/yyyy'),
    credentialType: <GetCredentialTypes id={row.id} />,
    icon: <GetConnectorIcons handler={row.data.handler} />,
    // inUseBy: <GetRelatedIntegrations name={row.id} />,
  }));

  const { selected, handleCheck, isSelected, handleSelectAllCheck, handleRowDelete } = useEntityTable({
    page,
    setPage,
    rowsPerPage,
    rows,
  });

  const handleClickRow = (row: BaseTableRow) => history.push(getRedirectLink(`/connector/${row.id}/configure`));

  const handleNewIntegration = () => {
    trackEventMemoized('New Connector Button Clicked', 'Connectors', {});
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
        emptyTableText="Your connector list is empty, please create a connector"
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        entityName="connector"
        headers={[
          { id: 'icon', value: '' },
          { id: 'name', value: 'Name' },
          { id: 'type', value: 'Type' },
          { id: 'identities', value: 'Identities' },
          { id: 'createdAt', value: 'Created At', sorted: true },
          { id: 'lastModified', value: 'Last Modified', sorted: true },
          { id: 'credentialType', value: 'Credential Type' },
          { id: 'inUseBy', value: 'In Use By' },
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
