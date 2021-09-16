import React from 'react';
import BaseTable from '../../../BaseTable';
import { useEntityTable } from '../../../../hooks/useEntityTable';
import { usePagination } from '../../../../hooks/usePagination';
import { useParams } from 'react-router-dom';
import { useAccountIntegrationInstanceGetAll } from '../../../../hooks/api/v2/account/integration/instance/useGetAll';
import { format } from 'date-fns';
import CodeBlock from '../../../CodeBlock';
import { Install } from '../../../../interfaces/install';
import Tag from '../../../Tag';

const InstallsTable = () => {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();
  const { id } = useParams<{ id: string }>();
  const { selected, handleCheck, isSelected, handleSelectAllCheck, handleRowDelete, setRows } = useEntityTable({
    page,
    setPage,
    rowsPerPage,
  });

  const { data, isLoading } = useAccountIntegrationInstanceGetAll<Install>(
    {
      id,
    },
    {
      // TODO: This is a workaround to calculate the select all checkbox
      onSuccess: (res) => setRows(res?.data?.items || []),
    }
  );

  const { items = [] } = data?.data || {};

  const rows = items.map((identity) => ({
    installID: identity.id,
    id: identity.id,
    dateCreated: format(new Date(identity.dateAdded), 'MM/dd/yyyy'),
    associatedIdentities: <Tag children={identity.dateAdded} />,
    listOfTags: <Tag children={identity.tags['session.master']} />,
    collapsableContent: <CodeBlock code={JSON.stringify(identity, null, ' ')} />,
  }));

  return (
    <BaseTable
      emptyTableText="Your installs list is empty"
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      page={page}
      rowsPerPage={rowsPerPage}
      headers={[
        { id: 'installID', value: 'Installs ID' },
        { id: 'dateCreated', value: 'Date Created' },
        { id: 'associatedIdentities', value: 'Associated Identities' },
        { id: 'listOfTags', value: 'List of tags' },
      ]}
      loading={isLoading}
      onDeleteAll={() => handleRowDelete('Install')}
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

export default InstallsTable;
