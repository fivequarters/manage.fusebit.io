import React from 'react';
import { TableCell, TableHead, TableRow, Checkbox } from '@material-ui/core';
import { BaseTableProps } from './types';

const BaseTableHead = ({
  rows,
  selected,
  onSelectAll,
  headers,
}: Pick<BaseTableProps, 'rows' | 'selected' | 'onSelectAll' | 'headers'>) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            checked={rows.length > 0 && selected.length === rows.length}
            onChange={onSelectAll}
          />
        </TableCell>
        {headers.map((header, index) => (
          <TableCell key={index} align="left">
            {header.value}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default BaseTableHead;
