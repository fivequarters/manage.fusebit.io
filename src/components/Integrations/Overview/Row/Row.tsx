import React from 'react';
import { useContext } from '../../../../hooks/useContext';
import * as SC from './styles';
import { TableCell, Checkbox } from '@material-ui/core';
import { useGetRedirectLink } from '../../../../hooks/useGetRedirectLink';
import { RowProps, cells } from '../../../../interfaces/integrations';
import { useAccountIntegrationInstanceGetAll } from '../../../../hooks/api/v2/account/integration/instance/useGetAll';
import { Install } from '../../../../interfaces/install';

const Row: React.FC<RowProps> = ({ row, handleRowClick, handleCheck, isSelected, mobile, selectedCell }) => {
  const { userData } = useContext();
  const { data: installsData } = useAccountIntegrationInstanceGetAll<Install>({
    enabled: userData.token,
    id: row.id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const { getRedirectLink } = useGetRedirectLink();

  if (!mobile) {
    return (
      <SC.Row key={row.id} onClick={(e) => handleRowClick(e, getRedirectLink('/integration/' + row.id))}>
        <TableCell style={{ cursor: 'default' }} padding="checkbox" id={`enhanced-table-cell-checkbox-${row.id}`}>
          <Checkbox
            color="primary"
            onClick={(event) => handleCheck(event, row.id)}
            checked={isSelected(row.id)}
            inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${row.id}` }}
            id={`enhanced-table-checkbox-${row.id}`}
          />
        </TableCell>
        <TableCell component="th" scope="row">
          <SC.CellName>{row.id}</SC.CellName>
        </TableCell>
        <TableCell align="left">{installsData?.data.total}</TableCell>
        <TableCell align="left">
          {new Date().toISOString().slice(0, 10)}
          {
            // TODO: Replace placeholder with real data
          }
        </TableCell>
        <TableCell align="left">
          {new Date().toISOString().slice(0, 10)}
          {
            // TODO: Replace placeholder with real data
          }
        </TableCell>
      </SC.Row>
    );
  } else {
    return (
      <SC.Row key={row.id} onClick={(e) => handleRowClick(e, getRedirectLink('/integration/' + row.id))}>
        <TableCell style={{ cursor: 'default' }} padding="checkbox" id={`enhanced-table-cell-checkbox-${row.id}`}>
          <Checkbox
            color="primary"
            onClick={(event) => handleCheck(event, row.id)}
            checked={isSelected(row.id)}
            inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${row.id}` }}
            id={`enhanced-table-checkbox-${row.id}`}
          />
        </TableCell>
        <TableCell component="th" scope="row">
          <SC.CellName>{row.id}</SC.CellName>
        </TableCell>
        <TableCell align="left">
          {selectedCell === cells.INSTANCES
            ? installsData?.data.total
            : selectedCell === cells.DEPLOYED
            ? new Date().toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10)}
          {
            // TODO: Replace placeholder with real data
          }
        </TableCell>
      </SC.Row>
    );
  }
};

export default Row;
