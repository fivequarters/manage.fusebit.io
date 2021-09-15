import React from 'react';
import BaseTable from '../../BaseTable/BaseTable';
import { useEntityTable } from '../../../hooks/useEntityTable';
import { usePagination } from '../../../hooks/usePagination';
import { Integration } from '../../../interfaces/integration';
import GetInstances from '../../TableRowComponent/GetInstances';

interface Props {
  headless: boolean;
  setHeadless: (value: boolean) => void;
  integrations?: {
    data: {
      items: Integration[];
    };
  };
}

const IntegrationsTable = ({ headless, setHeadless, integrations }: Props) => {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();

  const { loading, rows, selected, handleCheck, isSelected, handleSelectAllCheck, handleRowDelete } = useEntityTable({
    headless,
    setHeadless,
    integrations,
    page,
    setPage,
    rowsPerPage,
  });

  const tableRows = (rows as Integration[]).map((row) => ({
    id: row.id,
    name: row.id,
    installs: <GetInstances id={row.id} />,
    test: row.id,
  }));

  return (
    <BaseTable
      emptyTableText="Your integrations list is empty, please create an integration"
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      page={page}
      rowsPerPage={rowsPerPage}
      entityName="integrations"
      headers={['name', 'installs', 'test']}
      loading={loading}
      onClickNew={() => {}}
      onDeleteAll={handleRowDelete}
      onSelectAll={handleSelectAllCheck}
      rows={tableRows}
      onSelectRow={handleCheck}
      isSelected={isSelected}
      selected={selected}
    />
  );
};

export default IntegrationsTable;
