import React, { useState } from 'react';
import * as SC from './styles';
import * as CSC from '../globalStyle';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Checkbox,
  IconButton,
  Tooltip,
  TablePagination,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { ROWS_PER_PAGE_OPTIONS } from '../../hooks/usePagination';
import arrowRight from '../../assets/arrow-right.svg';
import arrowLeft from '../../assets/arrow-left.svg';
import { useMediaQuery } from '@material-ui/core';
import Row from './Row';
interface Props {
  selected: string[];
  loading: boolean;
  rows: {
    id: string;
    collapsableContent?: React.ReactNode | React.ReactText;
    [x: string]: React.ReactNode | React.ReactText;
  }[];
  onSelectAll: (e: any) => void;
  onDeleteAll: () => void;
  onClickNew?: () => void;
  headers: string[];
  entityName?: string;
  onSelectRow: (e: any, id: string) => void;
  isSelected: (id: string) => boolean;
  rowsPerPage: any;
  page: any;
  emptyTableText: string;
  handleChangePage: (e: any, newPage: number) => void;
  handleChangeRowsPerPage: (e: any) => void;
  collapseTrigger?: string;
  isCollapsible?: boolean;
}

const BaseTable: React.FC<Props> = ({
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
  handleChangePage,
  handleChangeRowsPerPage,
  isCollapsible,
  collapseTrigger,
}) => {
  const computedRowsPerPage = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const isMobile = useMediaQuery('(max-width: 880px)');
  const mobileArrowColumns = headers.slice(1);
  const [mobileColumnIndex, setMobileColumnIndex] = useState(0);

  const handleNextCellSelect = () => setMobileColumnIndex(mobileColumnIndex + 1);

  const handlePreviousCellSelect = () => setMobileColumnIndex(mobileColumnIndex - 1);

  const renderContent = () => {
    const hasDataToShow = rows.length > 0;

    if (hasDataToShow) {
      return (
        <>
          {isMobile ? (
            <div>
              <Table size="small" aria-label="Overview Table">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={rows.length > 0 && selected.length === rows.length}
                        onChange={onSelectAll}
                      />
                    </TableCell>
                    <TableCell>{headers[0]}</TableCell>
                    <TableCell align="left">
                      <SC.TableCellMobile>
                        <p>{mobileArrowColumns[mobileColumnIndex]}</p>
                        {mobileArrowColumns.length > 1 && (
                          <>
                            {!!mobileArrowColumns[mobileColumnIndex - 1] && (
                              <SC.LeftArrow
                                onClick={handlePreviousCellSelect}
                                src={arrowLeft}
                                alt="previous-cell"
                                height="16"
                                width="16"
                              />
                            )}

                            {!!mobileArrowColumns[mobileColumnIndex + 1] && (
                              <SC.RightArrow
                                onClick={handleNextCellSelect}
                                src={arrowRight}
                                alt="next-cell"
                                height="16"
                                width="16"
                              />
                            )}
                          </>
                        )}
                      </SC.TableCellMobile>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {computedRowsPerPage.map((row) => (
                    <Row
                      headers={headers}
                      checked={isSelected(row.id)}
                      currentMobileRow={mobileArrowColumns[mobileColumnIndex]}
                      onSelectRow={onSelectRow}
                      row={row}
                      isCollapsible={isCollapsible}
                      collapseTrigger={collapseTrigger}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div>
              <Table size="small" aria-label="Overview Table">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={rows.length > 0 && selected.length === rows.length}
                        onChange={onSelectAll}
                      />
                    </TableCell>
                    {headers.map((header, index) => (
                      <TableCell key={index} align="left">
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {computedRowsPerPage.map((row) => (
                    <Row
                      headers={headers}
                      checked={isSelected(row.id)}
                      currentMobileRow={mobileArrowColumns[mobileColumnIndex]}
                      onSelectRow={onSelectRow}
                      row={row}
                      isCollapsible={isCollapsible}
                      collapseTrigger={collapseTrigger}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <TablePagination
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </>
      );
    } else {
      return <SC.NoIntegrationWrapper>{emptyTableText}</SC.NoIntegrationWrapper>;
    }
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
