import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  Button,
  IconButton,
  Tooltip,
  useMediaQuery,
  TablePagination,
  Box,
  Checkbox,
} from '@material-ui/core';
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

const StyledDeleteIconWrapper = styled.div`
  margin-left: auto;
`;

const StyledDeleteText = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: var(--black);
  margin-left: 16px;

  & > strong {
    margin-left: 8px;
    color: var(--primary-color);
    cursor: pointer;
  }
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

const StyledButtonsContainer = styled(Box)<{ deleting?: boolean }>`
  height: 50px;
  background-color: ${(props) => (props.deleting ? 'var(--secondary-color)' : 'rgba(255,255,255,0)')};
  transition: all 0.25s linear;

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

  const isSelecting = selected.length > 0;

  const isAllSelected = isAllChecked || (rows.length > 0 && selected.length === rows.length);

  const deleteText = useMemo(() => {
    const textSuffix = `${entityName}${selected.length > 1 ? 's are selected' : ' is selelected'}`;

    if (isAllSelected) {
      return `All ${textSuffix}`;
    }

    return `${selected.length} ${textSuffix}`;
  }, [selected, isAllSelected, entityName]);

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
        <StyledButtonsContainer
          deleting={isSelecting}
          display="flex"
          mt="56px"
          mb="36px"
          justifyContent="flex-end"
          {...actionsContainerProps}
        >
          {isSelecting ? (
            <>
              <Checkbox color="primary" checked={isAllSelected} onChange={onSelectAll} style={{ marginLeft: '8px' }} />
              <StyledDeleteText>
                {deleteText}
                {!isMobile && !isAllSelected && (
                  <strong onClick={() => onSelectAll(undefined, true)}>
                    Select all {rows.length} {entityName}s
                  </strong>
                )}
              </StyledDeleteText>
              <StyledDeleteIconWrapper>
                <Tooltip title="Delete">
                  <IconButton onClick={onDeleteAll}>
                    <DeleteIcon style={{ color: '#333333' }} />
                  </IconButton>
                </Tooltip>
              </StyledDeleteIconWrapper>
            </>
          ) : (
            <>
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
            </>
          )}
        </StyledButtonsContainer>
      )}
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
