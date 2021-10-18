import React from 'react';
import { TableCell, TableHead, TableRow, Checkbox } from '@material-ui/core';
import { BaseTableProps } from './types';

const BaseTableHead = ({
  rows,
  selected,
  onSelectAll,
  headers,
  isAllChecked,
  hideCheckAll,
}: Pick<BaseTableProps, 'rows' | 'selected' | 'onSelectAll' | 'headers' | 'isAllChecked' | 'hideCheckAll'>) => {
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
            {header.value}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default BaseTableHead;
