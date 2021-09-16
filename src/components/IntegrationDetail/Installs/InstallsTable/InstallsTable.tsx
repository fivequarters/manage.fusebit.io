import React, { useState } from 'react';
import BaseTable from '../../../BaseTable';
import { useEntityTable } from '../../../../hooks/useEntityTable';
import { usePagination } from '../../../../hooks/usePagination';
import { useParams } from 'react-router-dom';
import { useAccountIntegrationInstanceGetAll } from '../../../../hooks/api/v2/account/integration/instance/useGetAll';
import { format } from 'date-fns';
import CodeBlock from '../../../CodeBlock';
import { Install } from '../../../../interfaces/install';
import Tag from '../../../Tag';
import ConfirmationPrompt from '../../../ConfirmationPrompt';

const InstallsTable = () => {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();
  const { id } = useParams<{ id: string }>();
  const { selected, handleCheck, isSelected, handleSelectAllCheck, handleRowDelete, setRows } = useEntityTable({
    page,
    setPage,
    rowsPerPage,
  });
  const [deleteOpen, setDeleteOpen] = useState(false);

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

  const handleDelete = () => {
    setDeleteOpen(false);
    handleRowDelete('Install');
  };

  return (
    <>
      <ConfirmationPrompt
        open={deleteOpen}
        setOpen={setDeleteOpen}
        handleConfirmation={handleDelete}
        title={`Are you sure you want to delete this Install?`}
        description={`You will lose your install.`}
      />
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
        onDeleteAll={() => setDeleteOpen(true)}
        onSelectAll={handleSelectAllCheck}
        rows={rows}
        onSelectRow={handleCheck}
        isSelected={isSelected}
        selected={selected}
        isCollapsible
        collapseTrigger="installID"
      />
    </>
  );
};

export default InstallsTable;
