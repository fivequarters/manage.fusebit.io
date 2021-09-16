import React, { useState } from 'react';
import { Table, TableBody, Button, IconButton, Tooltip, useMediaQuery } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Row from './Row';
import { BaseTableProps } from './types';
import * as SC from './styles';
import * as CSC from '../globalStyle';
import MobileBaseTableHeader from './MobileBaseTableHeader';
import BaseTableHead from './BaseTableHead';

const BaseTable: React.FC<BaseTableProps> = ({
  selected,
  loading,
  rows,
  onSelectAll,
  headers,
  onDeleteAll,
  onClickNew,
  entityName,
  onSelectRow,
  isSelected,
  rowsPerPage,
  page,
  emptyTableText,
  isCollapsible,
  collapseTrigger,
}) => {
  const computedRowsPerPage = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const isMobile = useMediaQuery('(max-width: 880px)');
  const mobileArrowColumns = headers.slice(1);
  console.log(headers);
  const [mobileColumnIndex, setMobileColumnIndex] = useState(0);

  const handleNextCellSelect = () => setMobileColumnIndex(mobileColumnIndex + 1);

  const handlePreviousCellSelect = () => setMobileColumnIndex(mobileColumnIndex - 1);

  const renderContent = () => {
    const hasDataToShow = rows.length > 0;

    if (!hasDataToShow) {
      return <SC.NoData>{emptyTableText}</SC.NoData>;
    }

    return (
      <SC.TableContainer>
        <Table size="small" aria-label="Overview Table">
          {isMobile ? (
            <MobileBaseTableHeader
              headers={headers}
              mobileArrowColumns={mobileArrowColumns}
              mobileColumnIndex={mobileColumnIndex}
              onNextCellSelect={handleNextCellSelect}
              onPreviousCellSelect={handlePreviousCellSelect}
              onSelectAll={onSelectAll}
              rows={rows}
              selected={selected}
            />
          ) : (
            <BaseTableHead headers={headers} onSelectAll={onSelectAll} rows={rows} selected={selected} />
          )}
          <TableBody>
            {computedRowsPerPage.map((row) => (
              <Row
                headers={headers}
                checked={isSelected(row.id)}
                currentMobileRow={mobileArrowColumns[mobileColumnIndex].value}
                onSelectRow={onSelectRow}
                row={row}
                isCollapsible={isCollapsible}
                collapseTrigger={collapseTrigger}
              />
            ))}
          </TableBody>
        </Table>
      </SC.TableContainer>
    );
  };

  return (
    <SC.Wrapper>
      {onClickNew && (
        <SC.ButtonContainer>
          <SC.ButtonMargin>
            <Button onClick={onClickNew} startIcon={<AddIcon />} variant="outlined" color="primary" size="large">
              New {entityName}
            </Button>
          </SC.ButtonMargin>
        </SC.ButtonContainer>
      )}

      <SC.DeleteWrapper active={selected.length > 0}>
        {selected.length > 0 && (
          <>
            {selected.length} selected
            <SC.DeleteIconWrapper>
              <Tooltip title="Delete">
                <IconButton onClick={onDeleteAll}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </SC.DeleteIconWrapper>
          </>
        )}
      </SC.DeleteWrapper>
      {loading ? (
        <CSC.LoaderContainer>
          <CSC.Spinner />
        </CSC.LoaderContainer>
      ) : (
        renderContent()
      )}
    </SC.Wrapper>
  );
};

export default BaseTable;
