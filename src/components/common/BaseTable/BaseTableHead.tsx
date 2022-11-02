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
  orderBy,
  onSortingPreferenceChange,
  entityNamePlural,
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
  | 'onSortingPreferenceChange'
  | 'entityNamePlural'
>) => {
  const handleSortRequest = (cellId: string) => {
    const isAsc = orderBy === cellId && order === 'asc';
    onSortingPreferenceChange?.(entityNamePlural, { order: isAsc ? 'desc' : 'asc', orderBy: cellId });
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
                active={orderBy === (header.sort?.sortVal as string)}
                direction={(orderBy === (header.sort?.sortVal as string) ? order : 'asc') as 'asc' | 'desc'}
                onClick={() => handleSortRequest(header.sort?.sortVal as string)}
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
