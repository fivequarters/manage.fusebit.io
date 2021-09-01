import React from 'react';
import { useContext } from '../../../../../hooks/useContext';
import { RowProps } from '../../../../../interfaces/connectors';
import { useAccountConnectorIdentityGetAll } from '../../../../../hooks/api/v2/account/connector/identity/useGetAll';
import { Identity } from '../../../../../interfaces/identities';
import TableRow from '../../../../TableRow';

const Row: React.FC<RowProps> = ({ row, handleRowClick, handleCheck, isSelected, mobile, selectedCell }) => {
  const { userData } = useContext();
  const { data: identitiesData } = useAccountConnectorIdentityGetAll<Identity>({
    enabled: userData.token,
    id: row.id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  return (
    <TableRow
      installs={identitiesData}
      connectorsTable={true}
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
