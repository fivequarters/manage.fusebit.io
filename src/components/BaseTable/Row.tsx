import React, { useState } from 'react';
import * as SC from './styles';
import { Checkbox, TableCell, Collapse, useMediaQuery } from '@material-ui/core';
import { BaseTableProps } from './types';

interface Props {
  row: any;
  headers: BaseTableProps['headers'];
  onSelectRow: (e: any, id: string) => void;
  checked: boolean;
  currentMobileRow: string | React.ReactNode;
  collapseTrigger?: string;
  isCollapsible?: boolean;
}

const Row = ({ row, onSelectRow, checked, headers, currentMobileRow, collapseTrigger, isCollapsible }: Props) => {
  const isMobile = useMediaQuery('(max-width: 880px)');
  const [isExpanded, setIsExpanded] = useState(false);

  const isCollapsibleTrigger = (stringToCompare: string) => {
    return collapseTrigger === stringToCompare;
  };

  const renderCollapsable = (row: any) => {
    return (
      <SC.ExpandableRow noBorder={isExpanded}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headers.length + 1}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            {row.collapsableContent}
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
    return (
      <>
        <SC.TableRow noBorder={isCollapsible}>
          {renderCheckbox(row.id)}
          <SC.TableCell
            isMain
            scope="row"
            isClickable
            onClick={collapseTrigger === headers[0].id ? () => setIsExpanded(!isExpanded) : undefined}
          >
            {row[headers[0].id]}
            {isCollapsibleTrigger(headers[0].id) && <SC.TriggerArrow active={isExpanded} isMain />}
          </SC.TableCell>
          <TableCell scope="row">{currentMobileRow}</TableCell>
        </SC.TableRow>
        {isCollapsible && renderCollapsable(row)}
      </>
    );
  };

  const renderDesktop = () => {
    return (
      <>
        <SC.TableRow noBorder={isCollapsible}>
          {renderCheckbox(row.id)}
          {headers.map((header, i: number) => (
            <SC.TableCell
              isMain={i === 0}
              isClickable={collapseTrigger === header.id}
              scope="row"
              onClick={collapseTrigger === header.id ? () => setIsExpanded(!isExpanded) : undefined}
            >
              {row[header.id]}
              {isCollapsibleTrigger(headers[0].id) && <SC.TriggerArrow active={isExpanded} isMain />}
            </SC.TableCell>
          ))}
        </SC.TableRow>
        {isCollapsible && renderCollapsable(row)}
      </>
    );
  };

  return <>{isMobile ? renderMobile() : renderDesktop()}</>;
};

export default Row;
