import React from 'react';
import { TableCell, Checkbox } from '@material-ui/core';
import * as SC from './styles';
import { useContext } from '../../../../../hooks/useContext';
import client from '../../../../../assets/client.jpg';
import { RowProps, cells } from '../../../../../interfaces/users';
import { useGetRedirectLink } from '../../../../../hooks/useGetRedirectLink';

const Row: React.FC<RowProps> = ({ row, handleRowClick, isSelected, selectedCell, handleCheck, mobile }) => {
  const { userData } = useContext();
  const { getRedirectLink } = useGetRedirectLink();

  if (!mobile) {
    return (
      <SC.Row
        key={row.id}
        onClick={(e) => handleRowClick(e, getRedirectLink('/authentication/' + row.id + '/overview'))}
      >
        <TableCell style={{ cursor: 'default' }} padding="checkbox" id={`enhanced-table-cell-checkbox-${row.id}`}>
          <Checkbox
            color="primary"
            onClick={(event) => handleCheck(event, row.id)}
            checked={isSelected(row.id)}
            inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${row.id}` }}
            id={`enhanced-table-checkbox-${row.id}`}
          />
        </TableCell>
        <TableCell>
          <SC.Flex>
            <SC.CellImage
              src={userData.userId === row.id ? userData.picture : client}
              alt="user"
              height="38"
              width="38"
            />
            <SC.CellName>
              {row.firstName} {row.lastName}
            </SC.CellName>
            {userData.userId === row.id && <SC.CellNameDetail>[me]</SC.CellNameDetail>}
          </SC.Flex>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.primaryEmail}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
      </SC.Row>
    );
  } else {
    return (
      <SC.Row
        key={row.id}
        onClick={(e) => handleRowClick(e, getRedirectLink('/authentication/' + row.id + '/overview'))}
      >
        <TableCell style={{ cursor: 'default' }} padding="checkbox" id={`enhanced-table-cell-checkbox-${row.id}`}>
          <Checkbox
            color="primary"
            onClick={(event) => handleCheck(event, row.id)}
            checked={isSelected(row.id)}
            inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${row.id}` }}
            id={`enhanced-table-checkbox-${row.id}`}
          />
        </TableCell>
        <TableCell align="left">
          {selectedCell === cells.EMAIL ? (
            row.primaryEmail
          ) : selectedCell === cells.NAME ? (
            <SC.Flex>
              <SC.CellImage
                src={userData.userId === row.id ? userData.picture : client}
                alt="user"
                height="38"
                width="38"
              />
              <SC.CellName>
                {row.firstName} {row.lastName}
              </SC.CellName>
            </SC.Flex>
          ) : (
            row.id
          )}
          {
            // TODO: Replace placeholder with real data
          }
        </TableCell>
      </SC.Row>
    );
  }
};

export default Row;
