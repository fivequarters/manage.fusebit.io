import React, { useState } from 'react';
import { Table, TableBody, Button, IconButton, Tooltip, useMediaQuery, TablePagination } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Row from './Row';
import { BaseTableProps } from './types';
import * as SC from './styles';
import * as CSC from '../globalStyle';
import MobileBaseTableHeader from './MobileBaseTableHeader';
import BaseTableHead from './BaseTableHead';
import { ROWS_PER_PAGE_OPTIONS } from '../../hooks/usePagination';

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
  onChangePage,
  onChangeRowsPerPage,
  onClickRow,
  noMainColumn,
  isAllChecked,
  headerButtons,
  hideCheckAll,
}) => {
  const computedRowsPerPage = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const isMobile = useMediaQuery('(max-width: 880px)');
  const mobileArrowColumns = headers.slice(1);
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
              isAllChecked={isAllChecked}
              hideCheckAll={hideCheckAll}
            />
          ) : (
            <BaseTableHead
              headers={headers}
              onSelectAll={onSelectAll}
              rows={rows}
              selected={selected}
              isAllChecked={isAllChecked}
              hideCheckAll={hideCheckAll}
            />
          )}
          <TableBody>
            {computedRowsPerPage.map((row) => (
              <Row
                key={row.id}
                onClick={onClickRow}
                headers={headers}
                checked={isSelected(row.id)}
                currentMobileRow={mobileArrowColumns[mobileColumnIndex].id}
                onSelectRow={onSelectRow}
                row={row}
                isCollapsible={isCollapsible}
                collapseTrigger={collapseTrigger}
                noMainColumn={noMainColumn}
              />
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={(e, value) => onChangePage?.(e, value)}
          onChangeRowsPerPage={(e) => onChangeRowsPerPage?.(e)}
        />
      </SC.TableContainer>
    );
  };

  return (
    <SC.Wrapper>
      {onClickNew && (
        <SC.ButtonsContainer display="flex" mt="56px" mb="36px" justifyContent="flex-end">
          {(headerButtons || [])?.map((button) => (
            <Button
              key={button.text}
              onClick={onClickNew}
              variant="outlined"
              color="primary"
              size="large"
              {...button.props}
            >
              {button.text}
            </Button>
          ))}
          <Button onClick={onClickNew} startIcon={<AddIcon />} variant="outlined" color="primary" size="large">
            New {entityName}
          </Button>
        </SC.ButtonsContainer>
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
