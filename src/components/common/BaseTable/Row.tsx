import { useState } from 'react';
import {
  Checkbox,
  TableCell,
  Collapse,
  useMediaQuery,
  TableRow as MUITableRow,
  TableCell as MUICellRow,
} from '@mui/material';
import { useQuery } from '@hooks/useQuery';
import styled, { css } from 'styled-components';
import upArrowPrimary from '@assets/up-arrow-primary.svg';
import { BaseTableProps, BaseTableRow } from './types';

const noBorderMixin = css`
  ${(props: { $noBorder?: boolean }) =>
    props.$noBorder &&
    css`
      & > td {
        border-bottom: 0;
      }
    `}
`;

const StyledExpandableRow = styled(MUITableRow)<{ $noBorder?: boolean }>`
  ${noBorderMixin}
`;

const StyledTableRow = styled(MUITableRow)<{ $noBorder?: boolean }>`
  display: table-row;
  outline: 0;
  vertical-align: middle;
  color: inherit;
  text-decoration: none;
  height: 65px;

  ${noBorderMixin}
`;

const StyledTableCell = styled(MUICellRow)<{ $isMain?: boolean; $isClickable?: boolean }>`
  position: relative;

  ${(props) =>
    props.$isMain &&
    css`
      & > div {
        color: var(--primary-color);
        font-weight: 500;
      }
    `}

  ${(props) =>
    props.$isClickable &&
    css`
      cursor: pointer;
    `}
`;

const StyledCellContent = styled.div<{ $isClickable?: boolean }>`
  ${(props) =>
    props.$isClickable &&
    css`
      display: flex;
      align-items: center;
    `}
`;

const StyledTriggerArrow = styled.div<{ $active: boolean; $isMain?: boolean }>`
  width: 14px;
  margin-left: 10px;
  height: 10px;
  background-image: url(${upArrowPrimary});
  background-size: contain;
  background-repeat: no-repeat;
  transform: ${(props) => props.$active && 'rotate(180deg)'};
  transition: all 0.25s linear;
  flex-shrink: 0;
  filter: ${(props) =>
    !props.$isMain &&
    'invert(0%) sepia(0%) saturate(0%) hue-rotate(279deg) brightness(95%) contrast(101%);'}; // this is #333333 converted to a filter

  @media only screen and (max-width: 880px) {
    margin-left: 5px;
  }
`;

interface Props {
  row: BaseTableRow;
  headers: BaseTableProps['headers'];
  onSelectRow: (e: any, id: string) => void;
  checked: boolean;
  currentMobileRow: string;
  collapseTrigger?: string;
  isCollapsible?: boolean;
  onClick?: (row: BaseTableRow, columnId: string) => void;
  noMainColumn?: BaseTableProps['noMainColumn'];
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
  noMainColumn,
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
      <StyledExpandableRow $noBorder={isExpanded}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headers.length + 1}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            {_row.collapsableContent}
          </Collapse>
        </TableCell>
      </StyledExpandableRow>
    );
  };

  const renderCheckbox = (id: string) => {
    return (
      <TableCell style={{ cursor: 'default' }} padding="checkbox" id={`enhanced-table-cell-checkbox-${id}`}>
        {row.hideCheckbox ? null : (
          <Checkbox
            color="primary"
            onClick={(e) => onSelectRow(e, id)}
            checked={checked}
            inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${id}` }}
            id={`enhanced-table-checkbox-${id}`}
          />
        )}
      </TableCell>
    );
  };

  const renderMobile = () => {
    const isCollapseTrigger = collapseTrigger === headers[0].id && !noMainColumn;

    return (
      <>
        <StyledTableRow $noBorder={isCollapsible}>
          {renderCheckbox(row.id)}
          <StyledTableCell
            $isMain={!noMainColumn}
            scope="row"
            $isClickable
            onClick={() => handleClickCell(isCollapseTrigger, headers[0].id)}
          >
            <StyledCellContent $isClickable>
              {row[headers[0].id]}
              {isCollapseTrigger && <StyledTriggerArrow $active={isExpanded} $isMain />}
            </StyledCellContent>
          </StyledTableCell>
          <StyledTableCell
            scope="row"
            onClick={() => handleClickCell(isCollapseTrigger, currentMobileRow)}
            $isClickable={isCollapseTrigger || !!onClick}
          >
            {row[currentMobileRow]}
          </StyledTableCell>
        </StyledTableRow>
        {isCollapsible && renderCollapsable(row)}
      </>
    );
  };

  const renderDesktop = () => {
    return (
      <>
        <StyledTableRow $noBorder={isCollapsible}>
          {renderCheckbox(row.id)}
          {headers.map((header, i: number) => {
            const isCollapseTrigger = collapseTrigger === header.id && !noMainColumn;

            return (
              <StyledTableCell
                key={header.id}
                $isMain={i === 0 && !noMainColumn}
                $isClickable={isCollapseTrigger || !!onClick}
                scope="row"
                onClick={() => handleClickCell(isCollapseTrigger, header.id)}
              >
                <StyledCellContent $isClickable={isCollapseTrigger}>
                  {row[header.id]}
                  {isCollapseTrigger && <StyledTriggerArrow $active={isExpanded} $isMain />}
                </StyledCellContent>
              </StyledTableCell>
            );
          })}
        </StyledTableRow>
        {isCollapsible && renderCollapsable(row)}
      </>
    );
  };

  return <>{isMobile ? renderMobile() : renderDesktop()}</>;
};

export default Row;
