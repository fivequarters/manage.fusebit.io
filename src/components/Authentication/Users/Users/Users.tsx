import React, { useEffect } from 'react';
import * as SC from './styles';
import * as CSC from '../../../globalStyle';
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
  Modal,
  Backdrop,
  TablePagination,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { useContext } from '../../../../hooks/useContext';
import { useLoader } from '../../../../hooks/useLoader';
import { Operation } from '../../../../interfaces/operation';
import { useError } from '../../../../hooks/useError';
import arrowRight from '../../../../assets/arrow-right.svg';
import arrowLeft from '../../../../assets/arrow-left.svg';
import NewUser from './NewUser';
import { useAccountUserGetAll } from '../../../../hooks/api/v1/account/user/useGetAll';
import { Account } from '../../../../interfaces/account';
import { useAccountUserCreateUser } from '../../../../hooks/api/v1/account/user/useCreateUser';
import { useCreateToken } from '../../../../hooks/useCreateToken';
import { UserCells } from '../../../../interfaces/tableRow';
import Row from './Row';
import { usePagination } from '../../../../hooks/usePagination';
import { useEntityTable } from '../../../../hooks/useEntityTable';

const Authentication: React.FC = () => {
  const [rows, setRows] = React.useState<Account[]>([]);
  const { userData } = useContext();
  const { data: users, refetch: reloadUsers } = useAccountUserGetAll<{ items: Account[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    params: 'include=all',
  });
  const { createLoader, removeLoader } = useLoader();
  const { createError } = useError();
  const [selectedCell, setSelectedCell] = React.useState<UserCells>(UserCells.NAME);
  const [newUserOpen, setNewUserOpen] = React.useState(false);
  const createUser = useAccountUserCreateUser<Operation>();
  const { _createToken } = useCreateToken();
  const [loading, setLoading] = React.useState(true);
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, ROWS_PER_PAGE_OPTIONS } = usePagination();
  const { handleSelectAllCheck, handleCheck, isSelected, handleRowClick, handleRowDelete, selected } = useEntityTable({
    reloadUsers,
  });

  useEffect(() => {
    if (users && users.data.items) {
      const items = users.data.items;
      setRows(items);
      setLoading(false);
    }
  }, [users]);

  const handlePreviousCellSelect = () => {
    if (selectedCell === UserCells.NAME) {
      setSelectedCell(UserCells.USER_ID);
    } else if (selectedCell === UserCells.EMAIL) {
      setSelectedCell(UserCells.NAME);
    } else {
      setSelectedCell(UserCells.EMAIL);
    }
  };

  const handleNextCellSelect = () => {
    if (selectedCell === UserCells.NAME) {
      setSelectedCell(UserCells.EMAIL);
    } else if (selectedCell === UserCells.EMAIL) {
      setSelectedCell(UserCells.USER_ID);
    } else {
      setSelectedCell(UserCells.NAME);
    }
  };

  const _createUser = async (data: Account) => {
    try {
      createLoader();
      const response = await createUser.mutateAsync({ ...data, accountId: userData.accountId });
      reloadUsers();
      if (response.data.id) {
        const token = await _createToken(response.data.id);
        return token;
      }
    } catch (e) {
      createError(e.message);
      removeLoader();
      setNewUserOpen(false);
      return null;
    } finally {
      removeLoader();
    }
  };

  return (
    <SC.Wrapper>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={newUserOpen}
        onClose={() => setNewUserOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <NewUser
          createUser={(data: Account) => _createUser(data)}
          open={newUserOpen}
          onClose={() => setNewUserOpen(false)}
        />
      </Modal>
      <SC.ButtonContainer>
        <SC.ButtonMargin>
          <Button
            onClick={() => setNewUserOpen(true)}
            startIcon={<AddIcon />}
            variant="outlined"
            color="primary"
            size="large"
          >
            New User
          </Button>
        </SC.ButtonMargin>
      </SC.ButtonContainer>
      <SC.DeleteWrapper active={selected.length > 0}>
        {selected.length > 0 && (
          <>
            {selected.length} selected
            <SC.DeleteIconWrapper>
              <Tooltip title="Delete">
                <IconButton onClick={handleRowDelete}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </SC.DeleteIconWrapper>
          </>
        )}
      </SC.DeleteWrapper>
      {!loading && (
        <>
          <SC.Table>
            <Table size="small" aria-label="Authentication Table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={rows.length > 0 && selected.length === rows.length}
                      onChange={handleSelectAllCheck}
                      inputProps={{ 'aria-label': 'select all users' }}
                    />
                  </TableCell>
                  <TableCell>
                    <SC.Flex>
                      <SC.ArrowUp />
                      Name
                    </SC.Flex>
                  </TableCell>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="left">User-ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: Account) => (
                  <Row
                    row={row}
                    handleCheck={handleCheck}
                    handleRowClick={handleRowClick}
                    isSelected={isSelected}
                    selectedCell={selectedCell}
                  />
                ))}
              </TableBody>
            </Table>
          </SC.Table>
          <SC.TableMobile>
            <Table size="small" aria-label="Authentication Table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={rows.length > 0 && selected.length === rows.length}
                      onChange={handleSelectAllCheck}
                      inputProps={{ 'aria-label': 'select all users' }}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <SC.TableCellMobile>
                      <p>{selectedCell}</p>
                      <SC.LeftArrow
                        onClick={handlePreviousCellSelect}
                        src={arrowLeft}
                        alt="previous-cell"
                        height="16"
                        width="16"
                      />

                      <SC.RightArrow
                        onClick={handleNextCellSelect}
                        src={arrowRight}
                        alt="next-cell"
                        height="16"
                        width="16"
                      />
                    </SC.TableCellMobile>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <Row
                    row={row}
                    handleCheck={handleCheck}
                    handleRowClick={handleRowClick}
                    isSelected={isSelected}
                    selectedCell={selectedCell}
                    mobile={true}
                  />
                ))}
              </TableBody>
            </Table>
          </SC.TableMobile>
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
      )}
      {loading && (
        <CSC.LoaderContainer>
          <CSC.Spinner />
        </CSC.LoaderContainer>
      )}
    </SC.Wrapper>
  );
};

export default Authentication;
