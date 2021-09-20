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
import InformationalBanner from '../../../InformationalBanner';
import List from '../../../List';
import AssociatedIdentities from './AssociatedIdentities';

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
    { id },
    {
      onSuccess: (res) => setRows(res?.data?.items || []),
    }
  );

  const { items = [] } = data?.data || {};

  const rows = items.map((identity) => ({
    installID: identity.id,
    id: identity.id,
    dateCreated: format(new Date(identity.dateAdded), 'MM/dd/yyyy'),
    associatedIdentities: <AssociatedIdentities instanceId={identity.tags['fusebit.tenantId']} />,
    listOfTags: (
      <List>
        {Object.keys(identity.tags).map((key) => {
          return <Tag>{key + ': ' + identity.tags[key]}</Tag>;
        })}
      </List>
    ),
    collapsableContent: <CodeBlock code={identity} />,
  }));

  const headers = [
    { id: 'installID', value: 'Installs ID' },
    { id: 'dateCreated', value: 'Date Created' },
    { id: 'associatedIdentities', value: 'Associated Identities' },
    { id: 'listOfTags', value: 'List of tags' },
  ];

  const handleDelete = () => {
    setDeleteOpen(false);
    handleRowDelete('Install', 'installs-table');
  };

  return (
    <div id="installs-table">
      <InformationalBanner
        description="Every time a tenant installs an integration, it will show up here for you to see."
        href="https://developer.fusebit.io/docs"
        highlightedDescription="Learn more about Installations in the docs here."
      />
      <ConfirmationPrompt
        open={deleteOpen}
        setOpen={setDeleteOpen}
        handleConfirmation={handleDelete}
        title={`​Are you sure you want to delete this ${selected.length > 1 ? 'Installs?' : 'Install?'}`}
        description={`Your tenants will have to re-install ${
          selected.length > 1 ? 'these integrations' : ' this integration'
        } in their account.`}
      />
      <BaseTable
        emptyTableText="Your installs list is empty"
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        headers={headers}
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
    </div>
  );
};

export default InstallsTable;
