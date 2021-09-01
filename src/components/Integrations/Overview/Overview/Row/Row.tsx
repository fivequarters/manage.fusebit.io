import React from 'react';
import { useContext } from '../../../../../hooks/useContext';
import { RowProps } from '../../../../../interfaces/integrations';
import { useAccountIntegrationInstanceGetAll } from '../../../../../hooks/api/v2/account/integration/instance/useGetAll';
import { Install } from '../../../../../interfaces/install';
import TableRow from '../../../../TableRow';

const Row: React.FC<RowProps> = ({ row, handleRowClick, handleCheck, isSelected, mobile, selectedCell }) => {
  const { userData } = useContext();
  const { data: installsData } = useAccountIntegrationInstanceGetAll<Install>({
    enabled: userData.token,
    id: row.id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  return (
    <TableRow
      installs={installsData}
      integrationsTable={true}
      row={row}
      handleRowClick={handleRowClick}
      handleCheck={handleCheck}
      isSelected={isSelected}
      mobile={mobile}
      selectedCell={selectedCell}
    />
  );
};

export default Row;
