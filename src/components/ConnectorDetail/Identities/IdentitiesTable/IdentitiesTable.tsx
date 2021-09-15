import React from 'react';
import BaseTable from '../../../BaseTable';
import { useEntityTable } from '../../../../hooks/useEntityTable';
import { usePagination } from '../../../../hooks/usePagination';
import { useParams } from 'react-router-dom';
import { useAccountConnectorIdentityGetAll } from '../../../../hooks/api/v2/account/connector/identity/useGetAll';
import { Identity } from '../../../../interfaces/identities';

const IntegrationsTable = () => {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();
  const { id } = useParams<{ id: string }>();
  const { selected, handleCheck, isSelected, handleSelectAllCheck, handleRowDelete, setRows } = useEntityTable({
    page,
    setPage,
    rowsPerPage,
  });

  const { data, isLoading } = useAccountConnectorIdentityGetAll<Identity>(
    {
      id,
    },
    {
      onSuccess: (res) => setRows(res?.data?.items || []),
    }
  );

  const { items = [] } = data?.data || {};

  const rows = items.map((identity) => ({
    installID: identity.id,
    id: identity.id,
    dateCreated: identity.dateAdded,
    associatedIdentities: identity.dateAdded,
    listOfTags: identity.id,
    collapsableContent: <div>asdsad</div>,
  }));

  return (
    <BaseTable
      emptyTableText="Your identities list is empty"
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      page={page}
      rowsPerPage={rowsPerPage}
      headers={['installID', 'dateCreated', 'associatedIdentities', 'listOfTags']}
      loading={isLoading}
      onDeleteAll={() => handleRowDelete('Identity')}
      onSelectAll={handleSelectAllCheck}
      rows={rows}
      onSelectRow={handleCheck}
      isSelected={isSelected}
      selected={selected}
      isCollapsible
      collapseTrigger="installID"
    />
  );
};

export default IntegrationsTable;
