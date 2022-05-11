import React, { useState } from 'react';
import { Table, TableBody, Button, IconButton, Tooltip, useMediaQuery, TablePagination, Box } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { ROWS_PER_PAGE_OPTIONS } from '@hooks/usePagination';
import * as CSC from '@components/globalStyle';
import styled from 'styled-components';
import Row from './Row';
import { BaseTableProps } from './types';
import MobileBaseTableHeader from './MobileBaseTableHeader';
import BaseTableHead from './BaseTableHead';

const StyledWrapper = styled.div`
  padding-bottom: 80px;
`;

const StyledDeleteWrapper = styled.div<{ active: boolean }>`
  display: ${(props) => (props.active ? 'flex' : 'none')};
  align-items: center;
  opacity: ${(props) => (props.active ? 1 : 0)};
  font-size: 18px;
  line-height: 22px;
  font-weight: 400;
  padding: 0 18px;
  min-height: 57px;
  width: 100%;
  color: ${(props) => (props.active ? 'var(--primary-color)' : 'var(--black)')};
  background-color: ${(props) => props.active && 'rgba(248, 52, 32, .1)'};
  margin-bottom: 12px;
  transition: all 0.25s linear;
`;

const StyledDeleteIconWrapper = styled.div`
  margin-left: auto;
`;

const StyledNoData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const StyledTableContainer = styled.div`
  overflow: auto;
  width: 100%;
`;

const StyledButtonsContainer = styled(Box)`
  margin-left: -20px;

  & > button {
    margin-left: 20px;
  }
`;

const BaseTable: React.FC<BaseTableProps> = ({
  selected,
  loading,
  rows,
  onSelectAll,
  headers,
  onDeleteAll,
  onClickNew,
  newButtonText,
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
  actionsContainerProps,
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
      return <StyledNoData>{emptyTableText}</StyledNoData>;
    }

    return (
      <StyledTableContainer>
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
      </StyledTableContainer>
    );
  };

  return (
    <StyledWrapper>
      {onClickNew && (
        <StyledButtonsContainer display="flex" mt="56px" mb="36px" justifyContent="flex-end" {...actionsContainerProps}>
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
            {newButtonText || `New ${entityName}`}
          </Button>
        </StyledButtonsContainer>
      )}

      <StyledDeleteWrapper active={selected.length > 0}>
        {selected.length > 0 && (
          <>
            {selected.length} selected
            <StyledDeleteIconWrapper>
              <Tooltip title="Delete">
                <IconButton onClick={onDeleteAll}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </StyledDeleteIconWrapper>
          </>
        )}
      </StyledDeleteWrapper>
      {loading ? (
        <CSC.LoaderContainer>
          <CSC.Spinner />
        </CSC.LoaderContainer>
      ) : (
        renderContent()
      )}
    </StyledWrapper>
  );
};

export default BaseTable;
