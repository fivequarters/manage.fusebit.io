import React from 'react';
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
import GetCredentialType from './GetCredentialType';
import GetConnectorIcon from './GetConnectorIcon';
import GetRelatedIntegrations from './GetRelatedIntegrations';

const ConnectorsTable = () => {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();
  const [newModalOpen, setNewModal, toggleNewModal] = useModal();
  const [deleteModalOpen, setDeleteModal, toggleDeleteModal] = useModal();
  const { getRedirectLink } = useGetRedirectLink();
  const history = useHistory();
  const { userData } = useAuthContext();
  const [emptyTableText, setEmptyTableText] = React.useState('Your connector list is empty, please create a connector');
  const { data: connectors, isLoading } = useAccountConnectorsGetAll<{ items: Connector[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  const [searchField, setSearchField] = React.useState('');
  const searchInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
    if (e.target.value === '') {
      setEmptyTableText('Your connector list is empty, please create a connector');
    } else {
      setEmptyTableText(`Connector with name ${e.target.value} not found`);
    }
    setPage(0);
  };

  useQueryParam({
    onSet: () => {
      setNewModal(true);
    },
    param: 'key',
  });

  const rows = (connectors?.data?.items || [])
    .map((row) => ({
      id: row.id,
      name: row.id,
      icon: <GetConnectorIcon handler={row.data.handler} name={row.id} />,
      type: row.tags['fusebit.service'],
      identities: <GetIdentities id={row.id} />,
      createdAt: format(new Date(row.dateAdded), 'MM/dd/yyyy'),
      sortableCreatedAt: new Date(row.dateAdded),
      lastModified: format(new Date(row.dateModified), 'MM/dd/yyyy'),
      sortableLastModified: new Date(row.dateModified),
      credentialType: <GetCredentialType id={row.id} />,
      inUseBy: <GetRelatedIntegrations name={row.id} />,
    }))
    .filter((item) => item.id.toLowerCase().includes(searchField));

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
        emptyTableText={emptyTableText}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        entityName="connector"
        entityNamePlural="connectors"
        headers={[
          { id: 'icon', value: '' },
          { id: 'name', value: 'Name', sort: { sortVal: 'name' } },
          { id: 'createdAt', value: 'Created At', sort: { sortVal: 'sortableCreatedAt' } },
          { id: 'lastModified', value: 'Last Modified', sort: { sortVal: 'sortableLastModified' } },
          { id: 'credentialType', value: 'Configuration' },
          { id: 'identities', value: 'Identities' },
          { id: 'inUseBy', value: 'Associated Integrations' },
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
        searchBarLabel="Connectors"
        searchInputHandler={searchInputHandler}
        textVal={searchField}
      />
    </>
  );
};

export default ConnectorsTable;
