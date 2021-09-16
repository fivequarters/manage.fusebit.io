import { useState } from 'react';
import BaseTable from '../../../BaseTable';
import { useEntityTable } from '../../../../hooks/useEntityTable';
import { usePagination } from '../../../../hooks/usePagination';
import { useParams } from 'react-router-dom';
import { useAccountConnectorIdentityGetAll } from '../../../../hooks/api/v2/account/connector/identity/useGetAll';
import { Identity } from '../../../../interfaces/identities';
import { format } from 'date-fns';
import CodeBlock from '../../../CodeBlock';
import ConfirmationPrompt from '../../../ConfirmationPrompt';
import * as SC from './styles';

const IntegrationsTable = () => {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();
  const { id } = useParams<{ id: string }>();
  const [deleteOpen, setDeleteOpen] = useState(false);
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
      identityId: identity.id,
      dateCreated: format(new Date(identity.dateAdded), 'MM/dd/yyyy'),
      collapsableContent: <CodeBlock code={JSON.stringify(json, null, ' ')} />,
    };
  });

  const handleDelete = () => {
    setDeleteOpen(false);
    handleRowDelete('Identity');
  };

  return (
    <>
      <SC.Banner
        description="An identity is a unique relationship your tenant has with a connector. It is used to authenticate on behalf of them when running an integration."
        href="https://developer.fusebit.io/docs"
        highlightedDescription="Learn more about Identities here."
      />
      <ConfirmationPrompt
        open={deleteOpen}
        setOpen={setDeleteOpen}
        handleConfirmation={handleDelete}
        title={`​Are you sure you want to delete this ${selected.length > 1 ? 'Identity?' : 'Identities?'}`}
        description="Your tenants will have to re-authenticate themselves in their account"
      />
      <BaseTable
        emptyTableText="Your identities list is empty"
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        headers={[
          { id: 'identityId', value: 'Identity ID' },
          { id: 'dateCreated', value: 'Date Created' },
        ]}
        loading={isLoading}
        onDeleteAll={() => setDeleteOpen(true)}
        onSelectAll={handleSelectAllCheck}
        rows={rows}
        onSelectRow={handleCheck}
        isSelected={isSelected}
        selected={selected}
        isCollapsible
        collapseTrigger="identityId"
      />
    </>
  );
};

export default IntegrationsTable;
