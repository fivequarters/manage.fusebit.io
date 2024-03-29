import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import BaseTable from '@components/common/BaseTable';
import { useAuthContext } from '@hooks/useAuthContext';
import { useEntityTable } from '@hooks/useEntityTable';
import { usePagination } from '@hooks/usePagination';
import { useAccountIntegrationInstallGetAll } from '@hooks/api/v2/account/integration/install/useGetAll';
import { useAccountIntegrationsGetOne } from '@hooks/api/v2/account/integration/useGetOne';
import CodeBlock from '@components/common/CodeBlock';
import { InstallList } from '@interfaces/install';
import { Integration } from '@interfaces/integration';
import Tag from '@components/common/Tag';
import ConfirmationPrompt from '@components/common/ConfirmationPrompt';
import InformationalBanner from '@components/common/InformationalBanner';
import { getConnectorsFromInstall } from '@utils/utils';
import { trackEventMemoized } from '@utils/analytics';
import AssociatedIdentities from './AssociatedIdentities';

const InstallsTable = () => {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();
  const { id } = useParams<{ id: string }>();
  const { userData } = useAuthContext();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: installs, isLoading } = useAccountIntegrationInstallGetAll<InstallList>({ id });
  const { data: integrationResponse } = useAccountIntegrationsGetOne<Integration>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  const integration = integrationResponse?.data;

  const rows = (installs?.data?.items || []).map((install) => {
    const connectorIds = getConnectorsFromInstall(install);

    return {
      id: install.id,
      installID: install.id,
      tenantID: <Tag>{install.tags['fusebit.tenantId']}</Tag>,
      createdAt: format(new Date(install.dateAdded), 'MM/dd/yyyy'),
      associatedIdentities: (
        <AssociatedIdentities tenantId={install.tags['fusebit.tenantId']} connectorIds={connectorIds} />
      ),
      collapsableContent: <CodeBlock code={install} />,
      collapsableContentOpened: () => {
        trackEventMemoized('Installs Expand Tenant Clicked', 'Integration');
      },
    };
  });

  const { selected, handleCheck, isSelected, handleSelectAllCheck, handleRowDelete } = useEntityTable({
    page,
    setPage,
    rowsPerPage,
    rows,
  });

  const headers = [
    { id: 'installID', value: 'Install ID' },
    {
      id: 'createdAt',
      value: 'Created At',
      sort: {
        sortVal: 'sortableCreatedAt',
      },
    },
    { id: 'tenantID', value: 'Tenant ID' },
    { id: 'associatedIdentities', value: 'Associated Identities' },
  ];

  const handleDelete = () => {
    trackEventMemoized('Installs Delete Tenant Clicked', 'Integration');
    setDeleteOpen(false);
    handleRowDelete('Install');
  };

  return (
    <div id="installs-table">
      <InformationalBanner>
        Every time a tenant installs an integration, it will show up here for you to see.{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://developer.fusebit.io/docs/fusebit-system-architecture#installation-lifecycle"
          onClick={() => {
            trackEventMemoized('Installs Docs Learn More Link Clicked', 'Integration', {
              Integration: integration?.tags['fusebit.feedId'],
            });
          }}
        >
          Learn more about Installations in the docs here
        </a>
        .
      </InformationalBanner>
      <ConfirmationPrompt
        open={deleteOpen}
        setOpen={setDeleteOpen}
        handleConfirmation={handleDelete}
        title={`Are you sure you want to delete ${selected.length > 1 ? 'these Installs?' : 'this Install?'}`}
        description={`Your tenants will have to re-install ${
          selected.length > 1 ? 'these integrations' : ' this integration'
        } in their account.`}
      />
      <BaseTable
        entityName="install"
        entityNamePlural="installs"
        emptyTableText="Your installs list is empty"
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
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
