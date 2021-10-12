import { useState } from 'react';
import { Checkbox, TableCell, Collapse, useMediaQuery } from '@material-ui/core';
import { BaseTableProps, BaseTableRow } from './types';
import * as SC from './styles';
import { useQuery } from '../../hooks/useQuery';

interface Props {
  row: BaseTableRow;
  headers: BaseTableProps['headers'];
  onSelectRow: (e: any, id: string) => void;
  checked: boolean;
  currentMobileRow: string;
  collapseTrigger?: string;
  isCollapsible?: boolean;
  onClick?: (row: BaseTableRow, columnId: string) => void;
}

const Row = ({
  row,
  onSelectRow,
  checked,
  headers,
  currentMobileRow,
  collapseTrigger,
  isCollapsible,
  onClick,
}: Props) => {
  const isMobile = useMediaQuery('(max-width: 880px)');
  const query = useQuery();
  const [isExpanded, setIsExpanded] = useState(query.get('expanded')?.split(',').includes(row.id) || false);

  const handleClickCell = (isCollapseTrigger: boolean, columnId: string) => {
    if (!isExpanded) {
      row.collapsableContentOpened?.();
    }

    if (isCollapseTrigger) {
      setIsExpanded(!isExpanded);
    }

    onClick?.(row, columnId);
  };

  const renderCollapsable = (_row: BaseTableRow) => {
    return (
      <SC.ExpandableRow $noBorder={isExpanded}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headers.length + 1}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            {_row.collapsableContent}
          </Collapse>
        </TableCell>
      </SC.ExpandableRow>
    );
  };

  const renderCheckbox = (id: string) => {
    return (
      <TableCell style={{ cursor: 'default' }} padding="checkbox" id={`enhanced-table-cell-checkbox-${id}`}>
        <Checkbox
          color="primary"
          onClick={(e) => onSelectRow(e, id)}
          checked={checked}
          inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${id}` }}
          id={`enhanced-table-checkbox-${id}`}
        />
      </TableCell>
    );
  };

  const renderMobile = () => {
    const isCollapseTrigger = collapseTrigger === headers[0].id;

    return (
      <>
        <SC.TableRow $noBorder={isCollapsible}>
          {renderCheckbox(row.id)}
          <SC.TableCell
            $isMain
            scope="row"
            $isClickable
            onClick={() => handleClickCell(isCollapseTrigger, headers[0].id)}
          >
            <SC.CellContent $isClickable={isCollapseTrigger}>
              {row[headers[0].id]}
              {isCollapseTrigger && <SC.TriggerArrow $active={isExpanded} $isMain />}
            </SC.CellContent>
          </SC.TableCell>
          <SC.TableCell
            scope="row"
            onClick={() => handleClickCell(isCollapseTrigger, currentMobileRow)}
            $isClickable={isCollapseTrigger || !!onClick}
          >
            {row[currentMobileRow]}
          </SC.TableCell>
        </SC.TableRow>
        {isCollapsible && renderCollapsable(row)}
      </>
    );
  };

  const renderDesktop = () => {
    return (
      <>
        <SC.TableRow $noBorder={isCollapsible}>
          {renderCheckbox(row.id)}
          {headers.map((header, i: number) => {
            const isCollapseTrigger = collapseTrigger === header.id;

            return (
              <SC.TableCell
                key={header.id}
                $isMain={i === 0}
                $isClickable={isCollapseTrigger || !!onClick}
                scope="row"
                onClick={() => handleClickCell(isCollapseTrigger, header.id)}
              >
                <SC.CellContent $isClickable={isCollapseTrigger}>
                  {row[header.id]}
                  {isCollapseTrigger && <SC.TriggerArrow $active={isExpanded} $isMain />}
                </SC.CellContent>
              </SC.TableCell>
            );
          })}
        </SC.TableRow>
        {isCollapsible && renderCollapsable(row)}
      </>
    );
  };

  return <>{isMobile ? renderMobile() : renderDesktop()}</>;
};

export default Row;
