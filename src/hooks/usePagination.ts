import React from 'react';

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

export const usePagination = () => {
  const [rowsPerPage, setRowsPerPage] = React.useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [page, setPage] = React.useState(0);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return {
    handleChangePage,
    handleChangeRowsPerPage,
    page,
    rowsPerPage,
    setPage,
  };
};
