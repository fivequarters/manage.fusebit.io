import React from 'react';
import { RowProps } from '../../../../../interfaces/connectors';
import TableRow from '../../../../TableRowComponent';

const Row: React.FC<RowProps> = ({ row, handleRowClick, handleCheck, isSelected, mobile, selectedCell }) => {
  return (
    <TableRow
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
