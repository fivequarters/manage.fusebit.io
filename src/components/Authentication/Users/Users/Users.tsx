import React, { useEffect } from 'react';
import * as SC from './styles';
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
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { useContext } from '../../../../hooks/useContext';
import { useLoader } from '../../../../hooks/useLoader';
import { useAccountUserDeleteOne } from '../../../../hooks/api/v1/account/user/useDeleteOne';
import { Operation } from '../../../../interfaces/operation';
import { useError } from '../../../../hooks/useError';
import arrowRight from '../../../../assets/arrow-right.svg';
import arrowLeft from '../../../../assets/arrow-left.svg';
import client from '../../../../assets/client.jpg';
import NewUser from './NewUser';
import { useGetRedirectLink } from '../../../../hooks/useGetRedirectLink';
import { useAccountUserGetAll } from '../../../../hooks/api/v1/account/user/useGetAll';
import { Account } from '../../../../interfaces/account';
import { useAccountUserCreateUser } from '../../../../hooks/api/v1/account/user/useCreateUser';
import { useCreateToken } from '../../../../hooks/useCreateToken';

enum cells {
  NAME = 'Name',
  EMAIL = 'Email',
  USER_ID = 'User-ID',
}

const Authentication: React.FC = () => {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [rows, setRows] = React.useState<Account[]>([]);
  const { userData } = useContext();
  const { data: users, refetch: reloadUsers } = useAccountUserGetAll<{ items: Account[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    params: 'include=all',
  });
  const deleteAccount = useAccountUserDeleteOne<Operation>();
  const { waitForOperations, createLoader, removeLoader } = useLoader();
  const { createError } = useError();
  const [selectedCell, setSelectedCell] = React.useState<cells>(cells.NAME);
  const [newUserOpen, setNewUserOpen] = React.useState(false);
  const { getRedirectLink } = useGetRedirectLink();
  const createUser = useAccountUserCreateUser<Operation>();
  const { _createToken } = useCreateToken();

  useEffect(() => {
    if (users && users.data.items) {
      const items = users.data.items;
      setRows(items);
    }
  }, [users]);

  const handleSelectAllCheck = (event: any) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((row) => row.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleCheck = (event: any, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const handleRowDelete = async () => {
    try {
      createLoader();
      let operationIds: string[] = [];
      for (let i = 0; i < selected.length; i++) {
        const response = await deleteAccount.mutateAsync({ userId: selected[i], accountId: userData.accountId });
        operationIds.push(response.data.operationId);
      }
      await waitForOperations(operationIds);
      reloadUsers();
      setSelected([]);
    } catch (e) {
      createError(e.message);
    } finally {
      removeLoader();
    }
  };

  const handleRowClick = (event: any, href: string) => {
    // TODO: check if the user has auth to edit this row before sending him there, and if not send this error
    // if (has auth) {
    //     if (!event.target.id) {
    //         window.location.href = href;
    //     }
    // } else {
    //     createError("You don't have sufficient permissions to edit integration {integration}.  Please contact an account administrator.");
    // }
    if (!event.target.id) {
      window.location.href = href;
    }
  };

  const handlePreviousCellSelect = () => {
    if (selectedCell === cells.NAME) {
      setSelectedCell(cells.USER_ID);
    } else if (selectedCell === cells.EMAIL) {
      setSelectedCell(cells.NAME);
    } else {
      setSelectedCell(cells.EMAIL);
    }
  };

  const handleNextCellSelect = () => {
    if (selectedCell === cells.NAME) {
      setSelectedCell(cells.EMAIL);
    } else if (selectedCell === cells.EMAIL) {
      setSelectedCell(cells.USER_ID);
    } else {
      setSelectedCell(cells.NAME);
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
            {rows.map((row: Account) => (
              <SC.Row
                key={row.id}
                onClick={(e) => handleRowClick(e, getRedirectLink('/authentication/' + row.id + '/overview'))}
              >
                <TableCell
                  style={{ cursor: 'default' }}
                  padding="checkbox"
                  id={`enhanced-table-cell-checkbox-${row.id}`}
                >
                  <Checkbox
                    color="primary"
                    onClick={(event) => handleCheck(event, row.id || '')}
                    checked={isSelected(row.id || '')}
                    inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${row.id}` }}
                    id={`enhanced-table-checkbox-${row.id}`}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {
                    //TODO: Replace placeholder with real data (currently using the users)
                  }
                  <SC.Flex>
                    <SC.CellImage
                      src={userData.userId === row.id ? userData.picture : client}
                      alt="user"
                      height="38"
                      width="38"
                    />
                    <SC.CellName>
                      {row.firstName} {row.lastName}
                    </SC.CellName>
                    {userData.userId === row.id && <SC.CellNameDetail>[me]</SC.CellNameDetail>}
                  </SC.Flex>
                </TableCell>
                <TableCell align="left">
                  {row.primaryEmail}
                  {
                    // TODO: Replace placeholder with real data
                  }
                </TableCell>
                <TableCell align="left">
                  {row.id}
                  {
                    // TODO: Replace placeholder with real data
                  }
                </TableCell>
              </SC.Row>
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
            {rows.map((row) => (
              <SC.Row
                key={row.id}
                onClick={(e) => handleRowClick(e, getRedirectLink('/authentication/' + row.id + '/overview'))}
              >
                <TableCell
                  style={{ cursor: 'default' }}
                  padding="checkbox"
                  id={`enhanced-table-cell-checkbox-${row.id}`}
                >
                  <Checkbox
                    color="primary"
                    onClick={(event) => handleCheck(event, row.id)}
                    checked={isSelected(row.id)}
                    inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${row.id}` }}
                    id={`enhanced-table-checkbox-${row.id}`}
                  />
                </TableCell>
                <TableCell align="left">
                  {selectedCell === cells.EMAIL ? (
                    row.primaryEmail
                  ) : selectedCell === cells.NAME ? (
                    <SC.Flex>
                      <SC.CellImage
                        src={userData.userId === row.id ? userData.picture : client}
                        alt="user"
                        height="38"
                        width="38"
                      />
                      <SC.CellName>
                        {row.firstName} {row.lastName}
                      </SC.CellName>
                    </SC.Flex>
                  ) : (
                    row.id
                  )}
                  {
                    // TODO: Replace placeholder with real data
                  }
                </TableCell>
              </SC.Row>
            ))}
          </TableBody>
        </Table>
      </SC.TableMobile>
    </SC.Wrapper>
  );
};

export default Authentication;
