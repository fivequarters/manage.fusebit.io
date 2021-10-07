import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import BaseTable from '../../common/BaseTable';
import { useEntityTable } from '../../../hooks/useEntityTable';
import { usePagination } from '../../../hooks/usePagination';
import { useAccountIntegrationInstanceGetAll } from '../../../hooks/api/v2/account/integration/instance/useGetAll';
import { Install } from '../../../interfaces/install';
import Tag from '../../common/Tag';
import ConfirmationPrompt from '../../common/ConfirmationPrompt';
import InformationalBanner from '../../InformationalBanner';
import AssociatedIdentities from './AssociatedIdentities';
import { getConnectorsFromInstall } from '../../../utils/utils';
import { trackEvent } from '../../../utils/analytics';
import CodeBlock from '../../common/CodeBlock';

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

  const rows = items.map((install) => {
    const connectorIds = getConnectorsFromInstall(install);

    return {
      id: install.id,
      installID: install.id,
      tenantID: <Tag>{install.tags['fusebit.tenantId']}</Tag>,
      dateCreated: format(new Date(install.dateAdded), 'MM/dd/yyyy'),
      associatedIdentities: (
        <AssociatedIdentities tenantId={install.tags['fusebit.tenantId']} connectorIds={connectorIds} />
      ),
      collapsableContent: <CodeBlock code={install} />,
      collapsableContentOpened: () => {
        trackEvent('Installs Expand Tenant Clicked', 'Integration');
      },
    };
  });

  const headers = [
    { id: 'installID', value: 'Install ID' },
    { id: 'tenantID', value: 'Tenant ID' },
    { id: 'dateCreated', value: 'Date Created' },
    { id: 'associatedIdentities', value: 'Associated Identities' },
  ];

  const handleDelete = () => {
    trackEvent('Installs Delete Tenant Clicked', 'Integration');
    setDeleteOpen(false);
    handleRowDelete('Install', 'installs-table');
  };

  return (
    <div id="installs-table">
      <InformationalBanner>
        Every time a tenant installs an integration, it will show up here for you to see.{' '}
        <a href="https://developer.fusebit.io/docs/fusebit-system-architecture#installation-lifecycle">
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