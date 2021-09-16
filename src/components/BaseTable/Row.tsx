import React, { useState } from 'react';
import * as SC from './styles';
import * as CSC from '../globalStyle';
import { Checkbox, TableCell, TableRow, Collapse, useMediaQuery } from '@material-ui/core';

interface Props {
  row: any;
  headers: any;
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
      <>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headers.length + 1}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              {row.collapsableContent}
            </Collapse>
          </TableCell>
        </TableRow>
      </>
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
        <SC.TableRow key={row.id}>
          {renderCheckbox(row.id)}
          <SC.TableCell
            isMain
            component="th"
            scope="row"
            isClickable
            onClick={isCollapsibleTrigger(headers[0]) ? () => setIsExpanded(!isExpanded) : undefined}
          >
            {row[headers[0]]}
            {isCollapsibleTrigger(headers[0]) && <SC.TriggerArrow active={isExpanded} isMain />}
          </SC.TableCell>
          <TableCell component="th" scope="row">
            {currentMobileRow}
          </TableCell>
        </SC.TableRow>
        {isCollapsible && renderCollapsable(row)}
      </>
    );
  };

  const renderDesktop = () => {
    return (
      <>
        <SC.TableRow key={row.id}>
          {renderCheckbox(row.id)}
          {headers.map((header: any, i: number) => (
            <SC.TableCell
              isMain={i === 0}
              isClickable={isCollapsibleTrigger(header)}
              component="th"
              scope="row"
              onClick={isCollapsibleTrigger(header) ? () => setIsExpanded(!isExpanded) : undefined}
            >
              <CSC.Flex>
                {row[header]}
                {isCollapsibleTrigger(header) && <SC.TriggerArrow active={isExpanded} isMain={i === 0} />}
              </CSC.Flex>
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
