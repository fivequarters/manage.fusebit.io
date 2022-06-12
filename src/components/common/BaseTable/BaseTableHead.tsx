import { TableCell, TableHead, TableRow, Checkbox, TableSortLabel } from '@material-ui/core';
import { BaseTableProps } from './types';

const BaseTableHead = ({
  rows,
  selected,
  onSelectAll,
  headers,
  isAllChecked,
  hideCheckAll,
  order,
  setOrder,
  orderBy,
  setOrderBy,
}: Pick<
  BaseTableProps,
  | 'rows'
  | 'selected'
  | 'onSelectAll'
  | 'headers'
  | 'isAllChecked'
  | 'hideCheckAll'
  | 'order'
  | 'orderBy'
  | 'setOrder'
  | 'setOrderBy'
>) => {
  const handleSortRequest = (cellId: string) => {
    const isAsc = orderBy === cellId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(cellId);
    console.log(order, orderBy);
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
            {header.sort ? (
              <TableSortLabel
                active={orderBy === header.id}
                direction={(orderBy === header.id ? order : 'asc') as 'asc' | 'desc'}
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
