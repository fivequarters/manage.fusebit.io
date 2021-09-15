import React from 'react';
import BaseTable from '../../../BaseTable';
import { useEntityTable } from '../../../../hooks/useEntityTable';
import { usePagination } from '../../../../hooks/usePagination';
import { useParams } from 'react-router-dom';
import { useAccountConnectorIdentityGetAll } from '../../../../hooks/api/v2/account/connector/identity/useGetAll';
import { Identity } from '../../../../interfaces/identities';
import { format } from 'date-fns';
import CodeBlock from '../../../CodeBlock';

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
      // TODO: This is a workaround to calculate the select all checkbox
      onSuccess: (res) => setRows(res?.data?.items || []),
    }
  );

  const { items = [] } = data?.data || {};

  const rows = items.map((identity) => {
    const json = {
      id: identity.id,
      data: identity.data,
      tags: identity.tags,
      version: identity.version,
      expires: identity.expires,
      dateAdded: identity.dateAdded,
      dateModified: identity.dateModified,
    };

    return {
      id: identity.id,
      installID: identity.id,
      dateCreated: format(new Date(identity.dateAdded), 'MM/dd/yyyy'),
      associatedInstalls: 'associatedIdentities',
      associatedIntegrations: 'associatedIntegrations',
      collapsableContent: <CodeBlock code={JSON.stringify(json, null, ' ')} />,
    };
  });

  return (
    <BaseTable
      emptyTableText="Your identities list is empty"
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      page={page}
      rowsPerPage={rowsPerPage}
      headers={['installID', 'dateCreated', 'associatedInstalls', 'associatedIntegrations']}
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
