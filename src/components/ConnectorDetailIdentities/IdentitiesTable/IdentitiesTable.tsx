import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import BaseTable from '@components/common/BaseTable';
import { useEntityTable } from '@hooks/useEntityTable';
import { usePagination } from '@hooks/usePagination';
import { useAccountConnectorIdentityGetAll } from '@hooks/api/v2/account/connector/identity/useGetAll';
import { IdentityList } from '@interfaces/identities';
import CodeBlock from '@components/common/CodeBlock';
import ConfirmationPrompt from '@components/common/ConfirmationPrompt';
import InformationalBanner from '@components/common/InformationalBanner';
import Tag from '@components/common/Tag';
import { trackEventMemoized } from '@utils/analytics';
import { useAccountConnectorsGetOne } from '@hooks/api/v2/account/connector/useGetOne';
import { Connector } from '@interfaces/connector';
import { useAuthContext } from '@hooks/useAuthContext';
import AssociatedInstalls from './AssociatedInstalls';
import AssociatedIntegrations from './AssociatedIntegrations';

const IdentitiesTable = () => {
  const { userData } = useAuthContext();
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();
  const { id } = useParams<{ id: string }>();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: identities, isLoading } = useAccountConnectorIdentityGetAll<IdentityList>({
    id,
  });

  const { data: connectorResponse } = useAccountConnectorsGetOne<Connector>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const connector = connectorResponse?.data;

  const rows = (identities?.data?.items || []).map((identity) => {
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
      collapsableContentOpened: () => {
        trackEventMemoized('Identities Expand Identity Clicked', 'Connector');
      },
    };
  });

  const { selected, handleCheck, isSelected, handleSelectAllCheck, handleRowDelete } = useEntityTable({
    page,
    setPage,
    rowsPerPage,
    rows,
  });

  const handleDelete = () => {
    trackEventMemoized('Identities Delete Identity Clicked', 'Connector');
    setDeleteOpen(false);
    handleRowDelete('Identity');
  };

  return (
    <div id="identities-table">
      <InformationalBanner>
        An identity is a unique relationship your tenant has with a connector. It is used to authenticate on behalf of
        them when running an integration.{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://developer.fusebit.io/docs/fusebit-system-architecture#installation-lifecycle"
          onClick={() => {
            trackEventMemoized('Identities Docs Learn More Link Clicked', 'Connector', {
              Connector: connector?.tags['fusebit.feedId'],
            });
          }}
        >
          Learn more about Identities here
        </a>
        .
      </InformationalBanner>
      <ConfirmationPrompt
        open={deleteOpen}
        setOpen={setDeleteOpen}
        handleConfirmation={handleDelete}
        title={`Are you sure you want to delete ${selected.length > 1 ? 'these Identities?' : 'this Identity?'}`}
        description="Your tenants will have to re-authenticate themselves in their account"
      />
      <BaseTable
        entityName="identity"
        entityNamePlural="identities"
        emptyTableText="Your identities list is empty"
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
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

export default IdentitiesTable;
