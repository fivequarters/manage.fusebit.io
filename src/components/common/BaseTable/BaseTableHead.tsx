import React, { useState } from 'react';
import { TableCell, TableHead, TableRow, Checkbox, TableSortLabel } from '@material-ui/core';
import { BaseTableProps } from './types';

const BaseTableHead = ({
  rows,
  selected,
  onSelectAll,
  headers,
  isAllChecked,
  hideCheckAll,
}: Pick<BaseTableProps, 'rows' | 'selected' | 'onSelectAll' | 'headers' | 'isAllChecked' | 'hideCheckAll'>) => {
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('');
  const handleSortRequest = (cellId: string) => {
    const isAsc = orderBy === cellId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(cellId);
  };
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {!hideCheckAll && (
            <Checkbox
              color="primary"
              checked={isAllChecked || (rows.length > 0 && selected.length === rows.length)}
              onChange={onSelectAll}
            />
          )}
        </TableCell>
        {headers.map((header) => (
          <TableCell style={{ whiteSpace: 'nowrap' }} key={header.id} align="left">
            {header.sorted ? (
              <TableSortLabel
                active={orderBy === header.id ? !!order : false}
                direction={(orderBy === header.id ? order : 'asc') as 'desc' | 'asc' | undefined}
                onClick={() => handleSortRequest(header.id)}
              >
                {header.value}
              </TableSortLabel>
            ) : (
              header.value
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default BaseTableHead;
