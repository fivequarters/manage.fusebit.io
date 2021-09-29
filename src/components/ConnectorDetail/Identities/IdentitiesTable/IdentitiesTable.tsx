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
import InformationalBanner from '../../../InformationalBanner';
import AssociatedInstalls from './AssociatedInstalls';
import AssociatedIntegrations from './AssociatedIntegrations';
import Tag from '../../../Tag';

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
    const connectorId = identity.tags['fusebit.parentEntityId'];

    return {
      id: identity.id,
      identityId: identity.id,
      tenantId: <Tag>{identity.tags['fusebit.tenantId']}</Tag>,
      dateCreated: format(new Date(identity.dateAdded), 'MM/dd/yyyy'),
      associatedInstalls: <AssociatedInstalls tenantId={identity.tags['fusebit.tenantId']} connectorId={connectorId} />,
      associatedIntegrations: (
        <AssociatedIntegrations tenantId={identity.tags['fusebit.tenantId']} connectorId={connectorId} />
      ),
      collapsableContent: <CodeBlock code={identity} />,
    };
  });

  const handleDelete = () => {
    setDeleteOpen(false);
    handleRowDelete('Identity', 'identities-table');
  };

  return (
    <div id="identities-table">
      <InformationalBanner>
        An identity is a unique relationship your tenant has with a connector. It is used to authenticate on behalf of
        them when running an integration.{' '}
        <a href="https://developer.fusebit.io/docs">Learn more about Identities here</a>.
      </InformationalBanner>
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
          { id: 'tenantId', value: 'Tenant ID' },
          { id: 'associatedIntegrations', value: 'Associated Integrations' },
          { id: 'associatedInstalls', value: 'Associated Installs' },
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
    </div>
  );
};

export default IntegrationsTable;
