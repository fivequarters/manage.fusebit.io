import React from 'react';
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
  Modal,
  Backdrop,
  TablePagination,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import arrowRight from '../../assets/arrow-right.svg';
import arrowLeft from '../../assets/arrow-left.svg';
import { Feed } from '../../interfaces/feed';
import FeedPicker from '../FeedPicker';
import { Data } from '../../interfaces/feedPicker';
import TableRowComponent from '../TableRowComponent';
import { ROWS_PER_PAGE_OPTIONS, usePagination } from '../../hooks/usePagination';
import { useEntityTable } from '../../hooks/useEntityTable';
import { Props } from '../../interfaces/tableComponent';
import { useEntityApi } from '../../hooks/useEntityApi';
import NewUser from '../Authentication/Users/Users/NewUser';
import { Row } from '../../interfaces/tableRow';
import ConfirmationPrompt from '../ConfirmationPrompt/ConfirmationPrompt';
import { trackEvent } from '../../utils/analytics';

const TableComponent: React.FC<Props> = ({
  headless,
  setHeadless,
  handleNextCellSelect,
  handlePreviousCellSelect,
  integrationTable,
  connectorTable,
  selectedCell,
  integrations,
  connectors,
  users,
}) => {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();
  const { _createUser } = useEntityApi();
  const {
    handleSelectAllCheck,
    handleCheck,
    isSelected,
    handleRowDelete,
    handleRowClick,
    handleIntegrationCreation,
    handleConnectorCreation,
    loading,
    addIntegrationOpen,
    addConnectorOpen,
    newUserOpen,
    setAddIntegrationOpen,
    setAddConnectorOpen,
    setNewUserOpen,
    rows,
    selected,
    deleteModalOpen,
    setDeleteModalOpen,
  } = useEntityTable({
    headless,
    setHeadless,
    integrations,
    connectors,
    users,
    page,
    setPage,
    rowsPerPage,
  });

  const isPlural = selected.length > 1;
  const integrationText = integrationTable && (isPlural ? 'these Integrations' : 'this Integration');
  const connectorText = connectorTable && (isPlural ? 'these Connectors' : 'this Connector');
  const usersText = !integrationTable && !connectorTable && (isPlural ? 'these Users' : 'this User');

  const allSelected = () => {
    let allSelected = false;

    if (rows.length > 1 && users) {
      allSelected = selected.length === rows.length - 1;
    } else if (rows.length > 0) {
      allSelected = selected.length === rows.length;
    }

    return allSelected;
  };

  return (
    <SC.Wrapper>
      {integrationTable ? (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={addIntegrationOpen}
          onClose={() => setAddIntegrationOpen(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
        >
          <FeedPicker
            isIntegration={true}
            onSubmit={(activeIntegration: Feed, data: Data) => handleIntegrationCreation(activeIntegration, data)}
            open={addIntegrationOpen}
            onClose={() => setAddIntegrationOpen(false)}
          />
        </Modal>
      ) : connectorTable ? (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={addConnectorOpen}
          onClose={() => setAddConnectorOpen(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
        >
          <FeedPicker
            isIntegration={false}
            onSubmit={(activeIntegration: Feed, data: Data) => handleConnectorCreation(activeIntegration, data)}
            open={addConnectorOpen}
            onClose={() => setAddConnectorOpen(false)}
          />
        </Modal>
      ) : (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={newUserOpen}
          onClose={() => setNewUserOpen(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
        >
          <NewUser createUser={_createUser} open={newUserOpen} onClose={() => setNewUserOpen(false)} />
        </Modal>
      )}

      <ConfirmationPrompt
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        handleConfirmation={handleRowDelete}
        title={`Are you sure you want to delete ${integrationText || connectorText || usersText}?`}
        description={
          integrationTable || connectorTable
            ? `You cannot undo this action and any linked applications may not work as expected.`
            : `Deleting ${usersText} will remove all of their access to Fusebit. You will have to re-add them again.`
        }
      />

      <SC.ButtonContainer>
        <SC.ButtonMargin>
          <Button
            onClick={() => {
              if (integrationTable) {
                trackEvent('New Integration Button Clicked', 'Integrations');
                return setAddIntegrationOpen(true);
              }
              if (connectorTable) {
                trackEvent('New Connector Button Clicked', 'Connectors');
                return setAddConnectorOpen(true);
              }
              trackEvent('New User Button Clicked', 'Users');
              return setNewUserOpen(true);
            }}
            startIcon={<AddIcon />}
            variant="outlined"
            color="primary"
            size="large"
          >
            New {integrationTable ? 'Integration' : connectorTable ? 'Connector' : 'User'}
          </Button>
        </SC.ButtonMargin>
      </SC.ButtonContainer>

      <SC.DeleteWrapper active={selected.length > 0}>
        {selected.length > 0 && (
          <>
            {selected.length} selected
            <SC.DeleteIconWrapper>
              <Tooltip title="Delete">
                <IconButton onClick={() => setDeleteModalOpen(true)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </SC.DeleteIconWrapper>
          </>
        )}
      </SC.DeleteWrapper>
      {!loading && rows.length > 0 ? (
        <>
          <SC.Table>
            <Table size="small" aria-label="Overview Table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={allSelected()}
                      onChange={handleSelectAllCheck}
                      inputProps={{
                        'aria-label': `select all ${
                          integrationTable ? 'integrations' : connectorTable ? 'connectors' : 'users'
                        }`,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <SC.Flex>
                      <SC.ArrowUp />
                      Name
                    </SC.Flex>
                  </TableCell>
                  {integrationTable ? (
                    <TableCell align="left">Installs</TableCell>
                  ) : connectorTable ? (
                    <>
                      <TableCell align="left">Type</TableCell>
                      <TableCell align="left">Identities</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell align="left">Email</TableCell>
                      <TableCell align="left">User-ID</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: Row) => (
                  <TableRowComponent
                    key={row.id}
                    integrationsTable={integrationTable}
                    connectorsTable={connectorTable}
                    row={row}
                    handleCheck={handleCheck}
                    handleRowClick={handleRowClick}
                    isSelected={isSelected}
                  />
                ))}
              </TableBody>
            </Table>
          </SC.Table>
          <SC.TableMobile>
            <Table size="small" aria-label="Overview Table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={allSelected()}
                      onChange={handleSelectAllCheck}
                      inputProps={{
                        'aria-label': `select all ${
                          integrationTable ? 'integrations' : connectorTable ? 'connectors' : 'users'
                        }`,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <SC.Flex>
                      <SC.ArrowUp />
                      Name
                    </SC.Flex>
                  </TableCell>
                  <TableCell align="left">
                    <SC.TableCellMobile>
                      <p>{selectedCell}</p>
                      <SC.LeftArrow
                        onClick={() => handlePreviousCellSelect()}
                        src={arrowLeft}
                        alt="previous-cell"
                        height="16"
                        width="16"
                      />

                      <SC.RightArrow
                        onClick={() => handleNextCellSelect()}
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
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: Row) => (
                  <TableRowComponent
                    key={row.id}
                    integrationsTable={integrationTable}
                    connectorsTable={connectorTable}
                    row={row}
                    handleCheck={handleCheck}
                    handleRowClick={handleRowClick}
                    isSelected={isSelected}
                    mobile={true}
                    selectedCell={selectedCell}
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
      ) : (
        !loading && (
          <SC.NoIntegrationWrapper>
            Your {integrationTable ? 'integrations' : 'connectors'} list is empty, please create{' '}
            {integrationTable ? 'an integration' : 'a connector'}
          </SC.NoIntegrationWrapper>
        )
      )}
      {loading && (
        <CSC.LoaderContainer>
          <CSC.Spinner />
        </CSC.LoaderContainer>
      )}
    </SC.Wrapper>
  );
};

export default TableComponent;
