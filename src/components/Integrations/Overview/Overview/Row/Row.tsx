import React from 'react';
import { useContext } from '../../../../../hooks/useContext';
import * as SC from './styles';
import * as CSC from '../../../../globalStyle';
import { TableCell, Checkbox } from '@material-ui/core';
import { useGetRedirectLink } from '../../../../../hooks/useGetRedirectLink';
import { RowProps, cells } from '../../../../../interfaces/integrations';
import { useAccountIntegrationInstanceGetAll } from '../../../../../hooks/api/v2/account/integration/instance/useGetAll';
import { Install } from '../../../../../interfaces/install';

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
      <SC.Row key={row.id} onClick={(e) => handleRowClick(e, getRedirectLink('/integration/' + row.id + '/develop'))}>
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
          {installsData?.data.total !== undefined ? installsData?.data.total : <CSC.Spinner />}
        </TableCell>
      </SC.Row>
    );
  } else {
    return (
      <SC.Row key={row.id} onClick={(e) => handleRowClick(e, getRedirectLink('/integration/' + row.id + '/develop'))}>
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
          {selectedCell === cells.INSTALLS && installsData?.data.total !== undefined ? (
            installsData?.data.total
          ) : (
            <CSC.Spinner />
          )}
        </TableCell>
      </SC.Row>
    );
  }
};

export default Row;
