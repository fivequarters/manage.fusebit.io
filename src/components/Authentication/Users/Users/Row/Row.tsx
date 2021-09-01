import React from 'react';
import { RowProps } from '../../../../../interfaces/users';
import TableRow from '../../../../TableRow';

const Row: React.FC<RowProps> = ({ row, handleRowClick, isSelected, selectedCell, handleCheck, mobile }) => {
  return (
    <TableRow
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
